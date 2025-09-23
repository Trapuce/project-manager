# PROMPT EXPLICITE - Backend Spring Boot pour ProjectHub

## 🎯 OBJECTIF
Développer un backend Spring Boot qui s'intègre parfaitement avec le frontend Next.js ProjectHub existant. Le backend doit gérer l'authentification JWT, la gestion de projets/tâches, l'upload de fichiers et fournir toutes les APIs nécessaires au frontend.

## 📋 SPÉCIFICATIONS TECHNIQUES OBLIGATOIRES

### Stack Technologique
- **Framework**: Spring Boot 3.2+
- **Base de données**: PostgreSQL 15+
- **ORM**: Spring Data JPA avec Hibernate
- **Sécurité**: Spring Security 6+ avec JWT
- **Documentation**: OpenAPI 3 (Swagger UI)
- **Tests**: JUnit 5 + Testcontainers
- **File Storage**: AWS S3 ou stockage local
- **Cache**: Redis (optionnel)

### Configuration Maven (pom.xml)
\`\`\`xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.2.0</version>
    </dependency>
</dependencies>
\`\`\`

## 🗄️ MODÈLE DE DONNÉES EXACT

### 1. Entité User
\`\`\`java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "first_name", nullable = false)
    private String firstName;
    
    @Column(name = "last_name", nullable = false)
    private String lastName;
    
    @Enumerated(EnumType.STRING)
    private Role role; // ADMIN, MANAGER, MEMBER
    
    @Enumerated(EnumType.STRING)
    private UserStatus status; // ACTIVE, INACTIVE, PENDING
    
    private String avatar;
    private String phone;
    private String department;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Relations
    @OneToMany(mappedBy = "assignee")
    private List<Task> assignedTasks;
    
    @ManyToMany(mappedBy = "members")
    private List<Project> projects;
}
\`\`\`

### 2. Entité Project
\`\`\`java
@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    private ProjectStatus status; // TODO, IN_PROGRESS, ON_HOLD, COMPLETED, ARCHIVED
    
    @Enumerated(EnumType.STRING)
    private Priority priority; // LOW, MEDIUM, HIGH
    
    private LocalDate startDate;
    private LocalDate dueDate;
    private LocalDate completedAt;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Relations
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;
    
    @ManyToMany
    @JoinTable(
        name = "project_members",
        joinColumns = @JoinColumn(name = "project_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> members;
    
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Task> tasks;
    
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<FileAttachment> files;
}
\`\`\`

### 3. Entité Task
\`\`\`java
@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    private TaskStatus status; // TODO, IN_PROGRESS, ON_HOLD, COMPLETED
    
    @Enumerated(EnumType.STRING)
    private Priority priority; // LOW, MEDIUM, HIGH
    
    private LocalDate dueDate;
    private LocalDateTime completedAt;
    private Integer estimatedHours;
    private Integer actualHours;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Relations
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
    
    @ManyToOne
    @JoinColumn(name = "assignee_id")
    private User assignee;
    
    @ManyToOne
    @JoinColumn(name = "creator_id")
    private User creator;
    
    @ManyToOne
    @JoinColumn(name = "parent_task_id")
    private Task parentTask;
    
    @OneToMany(mappedBy = "parentTask")
    private List<Task> subtasks;
    
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL)
    private List<Comment> comments;
    
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL)
    private List<FileAttachment> attachments;
}
\`\`\`

## 🔐 SÉCURITÉ JWT OBLIGATOIRE

### Configuration Security
\`\`\`java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
            .exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint()).and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/projects/**").hasAnyRole("MEMBER", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/projects/**").hasAnyRole("MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/projects/**").hasAnyRole("MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/projects/**").hasRole("ADMIN")
                .requestMatchers("/api/users/**").hasAnyRole("MANAGER", "ADMIN")
                .anyRequest().authenticated()
            );
        
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
\`\`\`

### CORS Configuration OBLIGATOIRE
\`\`\`java
@Configuration
public class CorsConfig {
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000", "https://your-domain.com"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
\`\`\`

## 🚀 ENDPOINTS API OBLIGATOIRES

### 1. Authentication Controller (/api/auth)
\`\`\`java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest request);
    
    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@RequestBody RegisterRequest request);
    
    @PostMapping("/refresh")
    public ResponseEntity<JwtResponse> refresh(@RequestBody RefreshTokenRequest request);
    
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout();
    
    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@RequestBody ForgotPasswordRequest request);
    
    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(@RequestBody ResetPasswordRequest request);
}
\`\`\`

### 2. Project Controller (/api/projects)
\`\`\`java
@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    
    @GetMapping
    public ResponseEntity<PagedResponse<ProjectResponse>> getAllProjects(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) ProjectStatus status,
        @RequestParam(required = false) Priority priority
    );
    
    @GetMapping("/{id}")
    public ResponseEntity<ProjectDetailResponse> getProjectById(@PathVariable Long id);
    
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@RequestBody CreateProjectRequest request);
    
    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable Long id, @RequestBody UpdateProjectRequest request);
    
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteProject(@PathVariable Long id);
    
    @PostMapping("/{id}/members")
    public ResponseEntity<MessageResponse> addMember(@PathVariable Long id, @RequestBody AddMemberRequest request);
    
    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<MessageResponse> removeMember(@PathVariable Long id, @PathVariable Long userId);
    
    @GetMapping("/{id}/tasks")
    public ResponseEntity<List<TaskResponse>> getProjectTasks(@PathVariable Long id);
    
    @GetMapping("/{id}/stats")
    public ResponseEntity<ProjectStatsResponse> getProjectStats(@PathVariable Long id);
}
\`\`\`

### 3. Task Controller (/api/tasks)
\`\`\`java
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    
    @GetMapping
    public ResponseEntity<PagedResponse<TaskResponse>> getAllTasks(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) TaskStatus status,
        @RequestParam(required = false) Priority priority,
        @RequestParam(required = false) Long projectId,
        @RequestParam(required = false) Long assigneeId,
        @RequestParam(required = false) LocalDate dueDateFrom,
        @RequestParam(required = false) LocalDate dueDateTo
    );
    
    @GetMapping("/{id}")
    public ResponseEntity<TaskDetailResponse> getTaskById(@PathVariable Long id);
    
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@RequestBody CreateTaskRequest request);
    
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long id, @RequestBody UpdateTaskRequest request);
    
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteTask(@PathVariable Long id);
    
    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(@PathVariable Long id, @RequestBody CreateCommentRequest request);
    
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentResponse>> getTaskComments(@PathVariable Long id);
    
    @GetMapping("/my-tasks")
    public ResponseEntity<List<TaskResponse>> getMyTasks();
    
    @GetMapping("/calendar")
    public ResponseEntity<List<TaskCalendarResponse>> getTasksForCalendar(
        @RequestParam LocalDate startDate,
        @RequestParam LocalDate endDate
    );
}
\`\`\`

### 4. File Controller (/api/files) - CRITIQUE
\`\`\`java
@RestController
@RequestMapping("/api/files")
public class FileController {
    
    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponse> uploadFile(
        @RequestParam("file") MultipartFile file,
        @RequestParam(required = false) Long taskId,
        @RequestParam(required = false) Long projectId
    );
    
    @GetMapping("/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id);
    
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteFile(@PathVariable Long id);
    
    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<FileAttachmentResponse>> getTaskFiles(@PathVariable Long taskId);
    
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<FileAttachmentResponse>> getProjectFiles(@PathVariable Long projectId);
}
\`\`\`

## 📝 DTOs OBLIGATOIRES

### Request DTOs
\`\`\`java
// Auth
public class LoginRequest {
    @NotBlank
    private String email;
    @NotBlank
    private String password;
}

public class RegisterRequest {
    @Email
    @NotBlank
    private String email;
    @NotBlank
    @Size(min = 6)
    private String password;
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotNull
    private Role role;
}

// Project
public class CreateProjectRequest {
    @NotBlank
    private String name;
    private String description;
    @NotNull
    private Priority priority;
    private LocalDate startDate;
    private LocalDate dueDate;
    private List<Long> memberIds;
}

// Task
public class CreateTaskRequest {
    @NotBlank
    private String title;
    private String description;
    @NotNull
    private Long projectId;
    private Long assigneeId;
    @NotNull
    private Priority priority;
    private LocalDate dueDate;
    private Integer estimatedHours;
}
\`\`\`

### Response DTOs
\`\`\`java
// Auth
public class JwtResponse {
    private String token;
    private String refreshToken;
    private String type = "Bearer";
    private UserResponse user;
}

// User
public class UserResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private UserStatus status;
    private String avatar;
    private LocalDateTime createdAt;
}

// Project
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private ProjectStatus status;
    private Priority priority;
    private LocalDate startDate;
    private LocalDate dueDate;
    private UserResponse owner;
    private List<UserResponse> members;
    private Integer totalTasks;
    private Integer completedTasks;
    private LocalDateTime createdAt;
}

// Task
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private Priority priority;
    private LocalDate dueDate;
    private ProjectResponse project;
    private UserResponse assignee;
    private UserResponse creator;
    private Integer estimatedHours;
    private Integer actualHours;
    private LocalDateTime createdAt;
}

// File
public class FileUploadResponse {
    private boolean success;
    private List<FileInfo> files;
    private String message;
}

public class FileInfo {
    private Long id;
    private String name;
    private String originalName;
    private Long size;
    private String type;
    private String url;
}
\`\`\`

## ⚙️ CONFIGURATION APPLICATION.YML

\`\`\`yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/projecthub
    username: ${DB_USERNAME:projecthub}
    password: ${DB_PASSWORD:password}
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
  
  liquibase:
    change-log: classpath:db/changelog/db.changelog-master.xml
  
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

jwt:
  secret: ${JWT_SECRET:myVerySecretKeyThatIsAtLeast256BitsLong}
  expiration: 86400000 # 24 hours
  refresh-expiration: 604800000 # 7 days

file:
  upload-dir: ${FILE_UPLOAD_DIR:./uploads}

server:
  port: 8080

springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html
\`\`\`

## 🗃️ MIGRATION BASE DE DONNÉES

### Script SQL Initial
\`\`\`sql
-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'MANAGER', 'MEMBER')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'PENDING')),
    avatar VARCHAR(500),
    phone VARCHAR(20),
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'TODO' CHECK (status IN ('TODO', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'ARCHIVED')),
    priority VARCHAR(10) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    start_date DATE,
    due_date DATE,
    completed_at TIMESTAMP,
    owner_id BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'TODO' CHECK (status IN ('TODO', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED')),
    priority VARCHAR(10) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    due_date DATE,
    completed_at TIMESTAMP,
    estimated_hours INTEGER,
    actual_hours INTEGER,
    project_id BIGINT NOT NULL REFERENCES projects(id),
    assignee_id BIGINT REFERENCES users(id),
    creator_id BIGINT NOT NULL REFERENCES users(id),
    parent_task_id BIGINT REFERENCES tasks(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project members junction table
CREATE TABLE project_members (
    project_id BIGINT NOT NULL REFERENCES projects(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    PRIMARY KEY (project_id, user_id)
);

-- Comments table
CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    task_id BIGINT NOT NULL REFERENCES tasks(id),
    author_id BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- File attachments table
CREATE TABLE file_attachments (
    id BIGSERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    original_file_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(100),
    file_size BIGINT,
    file_path VARCHAR(500) NOT NULL,
    task_id BIGINT REFERENCES tasks(id),
    project_id BIGINT REFERENCES projects(id),
    uploaded_by BIGINT NOT NULL REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_comments_task_id ON comments(task_id);
CREATE INDEX idx_file_attachments_task_id ON file_attachments(task_id);
CREATE INDEX idx_file_attachments_project_id ON file_attachments(project_id);
\`\`\`

## 🧪 TESTS OBLIGATOIRES

### Test d'Intégration
\`\`\`java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class ProjectControllerIntegrationTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void shouldCreateProject() {
        // Implémentation du test
    }
    
    @Test
    void shouldGetProjectsWithPagination() {
        // Test de pagination
    }
    
    @Test
    void shouldUploadFile() {
        // Test d'upload de fichier
    }
}
\`\`\`

## 🐳 DÉPLOIEMENT DOCKER

### Dockerfile
\`\`\`dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/projecthub-*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
\`\`\`

### docker-compose.yml
\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=postgres
      - DB_USERNAME=projecthub
      - DB_PASSWORD=password
      - JWT_SECRET=myVerySecretKeyThatIsAtLeast256BitsLong
    depends_on:
      - postgres
  
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: projecthub
      POSTGRES_USER: projecthub
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
\`\`\`

## 🔗 INTÉGRATION FRONTEND

### Variables d'environnement Frontend (.env.local)
\`\`\`bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
\`\`\`

### Service API Frontend (lib/api.ts)
\`\`\`typescript
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Gestion des erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export default api
\`\`\`

## ✅ CHECKLIST DE VALIDATION

### Fonctionnalités Obligatoires
- [ ] Authentification JWT complète (login, register, refresh, logout)
- [ ] CRUD complet pour Users, Projects, Tasks
- [ ] Upload/Download de fichiers avec gestion des erreurs
- [ ] Pagination sur tous les endpoints de liste
- [ ] Filtrage et recherche sur Projects et Tasks
- [ ] Gestion des rôles et permissions
- [ ] Validation des données avec Bean Validation
- [ ] Gestion globale des erreurs
- [ ] Documentation Swagger UI accessible
- [ ] Tests d'intégration avec Testcontainers
- [ ] Configuration CORS pour le frontend
- [ ] Logs structurés et monitoring

### Sécurité Obligatoire
- [ ] Mots de passe hashés avec BCrypt
- [ ] Tokens JWT sécurisés avec expiration
- [ ] Validation des autorisations sur chaque endpoint
- [ ] Protection CSRF désactivée pour API REST
- [ ] Headers de sécurité configurés
- [ ] Validation des uploads de fichiers

### Performance
- [ ] Index sur les colonnes fréquemment requêtées
- [ ] Pagination efficace avec LIMIT/OFFSET
- [ ] Lazy loading des relations JPA
- [ ] Cache Redis pour les données fréquentes (optionnel)

## 🚨 POINTS CRITIQUES

1. **JWT Secret**: DOIT être au moins 256 bits et stocké en variable d'environnement
2. **CORS**: DOIT autoriser localhost:3000 pour le développement
3. **Upload Files**: DOIT gérer les types de fichiers et tailles maximales
4. **Pagination**: DOIT être implémentée sur TOUS les endpoints de liste
5. **Validation**: DOIT valider TOUTES les entrées utilisateur
6. **Erreurs**: DOIT retourner des messages d'erreur cohérents en JSON
7. **Base de données**: DOIT utiliser des transactions pour les opérations complexes

## 📞 SUPPORT

En cas de problème, vérifiez dans l'ordre :
1. Configuration CORS
2. Format des tokens JWT
3. Structure des DTOs de réponse
4. Gestion des erreurs HTTP
5. Configuration de la base de données

Ce prompt vous donne TOUT ce qu'il faut pour développer un backend Spring Boot parfaitement intégré avec le frontend ProjectHub !
