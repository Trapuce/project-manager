# Spécifications Backend Spring Boot - ProjectHub

## Vue d'ensemble
Cette documentation détaille les spécifications complètes pour développer le backend Spring Boot qui s'intègre parfaitement avec le frontend Next.js de ProjectHub.

## Architecture Technique

### Stack Technologique Recommandée
- **Framework**: Spring Boot 3.2+
- **Base de données**: PostgreSQL 15+
- **ORM**: Spring Data JPA avec Hibernate
- **Sécurité**: Spring Security 6+ avec JWT
- **Documentation API**: OpenAPI 3 (Swagger)
- **Tests**: JUnit 5, Testcontainers
- **Cache**: Redis (optionnel)
- **File Storage**: AWS S3 ou équivalent

### Structure du Projet
\`\`\`
src/main/java/com/projecthub/
├── ProjectHubApplication.java
├── config/
│   ├── SecurityConfig.java
│   ├── JwtConfig.java
│   └── CorsConfig.java
├── controller/
│   ├── AuthController.java
│   ├── UserController.java
│   ├── ProjectController.java
│   ├── TaskController.java
│   └── FileController.java
├── service/
│   ├── AuthService.java
│   ├── UserService.java
│   ├── ProjectService.java
│   ├── TaskService.java
│   └── FileService.java
├── repository/
│   ├── UserRepository.java
│   ├── ProjectRepository.java
│   ├── TaskRepository.java
│   └── FileRepository.java
├── entity/
│   ├── User.java
│   ├── Project.java
│   ├── Task.java
│   ├── Comment.java
│   └── FileAttachment.java
├── dto/
│   ├── request/
│   └── response/
├── security/
│   ├── JwtAuthenticationFilter.java
│   ├── JwtTokenProvider.java
│   └── UserPrincipal.java
└── exception/
    ├── GlobalExceptionHandler.java
    └── CustomExceptions.java
\`\`\`

## Modèle de Données

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

### 4. Entité Comment
\`\`\`java
@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Relations
    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;
    
    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;
}
\`\`\`

### 5. Entité FileAttachment
\`\`\`java
@Entity
@Table(name = "file_attachments")
public class FileAttachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String fileName;
    
    @Column(nullable = false)
    private String originalFileName;
    
    private String contentType;
    private Long fileSize;
    private String filePath; // Chemin S3 ou local
    
    @CreationTimestamp
    private LocalDateTime uploadedAt;
    
    // Relations
    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;
    
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
    
    @ManyToOne
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;
}
\`\`\`

## API Endpoints

### 1. Authentication (/api/auth)
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

### 2. Users (/api/users)
\`\`\`java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping
    public ResponseEntity<PagedResponse<UserResponse>> getAllUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) Role role,
        @RequestParam(required = false) UserStatus status
    );
    
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id);
    
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser();
    
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateCurrentUser(@RequestBody UpdateUserRequest request);
    
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request);
    
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteUser(@PathVariable Long id);
    
    @GetMapping("/stats")
    public ResponseEntity<UserStatsResponse> getUserStats();
}
\`\`\`

### 3. Projects (/api/projects)
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
    
    @GetMapping("/stats")
    public ResponseEntity<ProjectsOverviewResponse> getProjectsOverview();
}
\`\`\`

### 4. Tasks (/api/tasks)
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
    
    @GetMapping("/stats")
    public ResponseEntity<TaskStatsResponse> getTaskStats();
}
\`\`\`

### 5. Files (/api/files)
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

## DTOs (Data Transfer Objects)

### Request DTOs
\`\`\`java
// Auth
public class LoginRequest {
    private String email;
    private String password;
}

public class RegisterRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private Role role;
}

// Project
public class CreateProjectRequest {
    private String name;
    private String description;
    private Priority priority;
    private LocalDate startDate;
    private LocalDate dueDate;
    private List<Long> memberIds;
}

// Task
public class CreateTaskRequest {
    private String title;
    private String description;
    private Long projectId;
    private Long assigneeId;
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
\`\`\`

## Configuration de Sécurité

### JWT Configuration
\`\`\`java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint() {
        return new JwtAuthenticationEntryPoint();
    }
    
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
            .exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint()).and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/auth/**").permitAll()
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

### CORS Configuration
\`\`\`java
@Configuration
public class CorsConfig {
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000", "https://your-frontend-domain.com"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
\`\`\`

## Validation et Gestion d'Erreurs

### Global Exception Handler
\`\`\`java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(ValidationException ex) {
        return ResponseEntity.badRequest().body(new ErrorResponse("VALIDATION_ERROR", ex.getMessage()));
    }
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.notFound().build();
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(new ErrorResponse("ACCESS_DENIED", "Accès refusé"));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse("INTERNAL_ERROR", "Erreur interne du serveur"));
    }
}
\`\`\`

## Configuration Base de Données

### application.yml
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
  secret: ${JWT_SECRET:mySecretKey}
  expiration: 86400000 # 24 hours
  refresh-expiration: 604800000 # 7 days

file:
  upload-dir: ${FILE_UPLOAD_DIR:./uploads}
  
aws:
  s3:
    bucket: ${AWS_S3_BUCKET:projecthub-files}
    region: ${AWS_REGION:eu-west-1}
\`\`\`

## Scripts de Migration Liquibase

### db.changelog-master.xml
\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
                   http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-4.0.xsd">

    <include file="db/changelog/001-create-users-table.xml"/>
    <include file="db/changelog/002-create-projects-table.xml"/>
    <include file="db/changelog/003-create-tasks-table.xml"/>
    <include file="db/changelog/004-create-comments-table.xml"/>
    <include file="db/changelog/005-create-file-attachments-table.xml"/>
    <include file="db/changelog/006-create-project-members-table.xml"/>
    <include file="db/changelog/007-insert-initial-data.xml"/>
</databaseChangeLog>
\`\`\`

## Tests

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
        // Test implementation
    }
}
\`\`\`

## Déploiement

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
    depends_on:
      - postgres
      - redis
  
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
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
\`\`\`

## Intégration Frontend

### Configuration Axios (Frontend)
\`\`\`typescript
// lib/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercepteur pour gérer les erreurs
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

### Services API (Frontend)
\`\`\`typescript
// services/authService.ts
export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (userData: RegisterData) =>
    api.post('/auth/register', userData),
  
  getCurrentUser: () =>
    api.get('/users/me'),
}

// services/projectService.ts
export const projectService = {
  getProjects: (params?: ProjectFilters) =>
    api.get('/projects', { params }),
  
  getProject: (id: number) =>
    api.get(`/projects/${id}`),
  
  createProject: (data: CreateProjectData) =>
    api.post('/projects', data),
  
  updateProject: (id: number, data: UpdateProjectData) =>
    api.put(`/projects/${id}`, data),
}
\`\`\`

## Monitoring et Observabilité

### Actuator Configuration
\`\`\`yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
  metrics:
    export:
      prometheus:
        enabled: true
\`\`\`

Cette documentation complète vous donne tous les éléments nécessaires pour développer un backend Spring Boot parfaitement intégré avec le frontend Next.js. Le backend respecte les meilleures pratiques de sécurité, performance et maintenabilité.
