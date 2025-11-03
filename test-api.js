#!/usr/bin/env node

/**
 * Script de test de toutes les APIs utilisées par le front-end
 * Usage: node test-api.js [baseUrl]
 * Exemple: node test-api.js http://localhost:8080
 */

const baseURL = process.argv[2] || 'https://projectHub.trapuce.tech';
let accessToken = null;
let refreshToken = null;
let testUserId = null;
let testProjectId = null;
let testTaskId = null;

// Couleurs pour l'affichage
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`TEST: ${testName}`, 'blue');
  log('='.repeat(60), 'cyan');
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message, error) {
  log(`✗ ${message}`, 'red');
  if (error) {
    console.error(error);
  }
}

async function makeRequest(method, endpoint, data = null, useAuth = false) {
  const url = `${baseURL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
  };

  if (useAuth && accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const options = {
    method,
    headers,
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();
    
    return {
      ok: response.ok,
      status: response.status,
      data: responseData,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error.message,
    };
  }
}

// ==================== TESTS AUTHENTIFICATION ====================

async function testRegister() {
  logTest('Inscription (Register)');
  const email = `test${Date.now()}@example.com`;
  const userData = {
    email,
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    department: 'IT',
    role: 'MEMBER',
  };

  // Tester d'abord si le backend est accessible
  try {
    const healthCheck = await fetch(`${baseURL}/actuator/health`);
    if (!healthCheck.ok) {
      logError(`Backend non accessible à ${baseURL}. Vérifiez que le backend est démarré.`);
      return false;
    }
  } catch (error) {
    logError(`Impossible de se connecter au backend à ${baseURL}. Erreur: ${error.message}`);
    log('Assurez-vous que le backend Spring Boot est démarré sur le port 8080', 'yellow');
    return false;
  }

  const result = await makeRequest('POST', '/api/auth/register', userData);

  if (result.ok && result.data.success) {
    accessToken = result.data.data.accessToken;
    refreshToken = result.data.data.refreshToken;
    testUserId = result.data.data.user.id;
    logSuccess(`Utilisateur créé: ${email} (ID: ${testUserId})`);
    logSuccess(`Access Token obtenu: ${accessToken.substring(0, 20)}...`);
    return true;
  } else {
    logError('Échec de l\'inscription', result.data || result.error);
    return false;
  }
}

async function testLogin() {
  logTest('Connexion (Login)');
  const credentials = {
    email: 'test@example.com',
    password: 'password123',
  };

  const result = await makeRequest('POST', '/api/auth/login', credentials);

  if (result.ok && result.data.success) {
    accessToken = result.data.data.accessToken;
    refreshToken = result.data.data.refreshToken;
    testUserId = result.data.data.user.id;
    logSuccess(`Connexion réussie pour: ${credentials.email}`);
    logSuccess(`Access Token obtenu: ${accessToken.substring(0, 20)}...`);
    return true;
  } else {
    logError('Échec de la connexion', result.data || result.error);
    // Essayer avec l'utilisateur créé
    if (!accessToken) {
      log('Tentative d\'inscription...', 'yellow');
      return await testRegister();
    }
    return false;
  }
}

async function testRefreshToken() {
  logTest('Rafraîchissement du Token (Refresh Token)');
  
  if (!refreshToken) {
    logError('Pas de refresh token disponible');
    return false;
  }

  const result = await makeRequest('POST', '/api/auth/refresh', { refreshToken });

  if (result.ok && result.data.success) {
    accessToken = result.data.data.accessToken;
    refreshToken = result.data.data.refreshToken;
    logSuccess('Token rafraîchi avec succès');
    return true;
  } else {
    logError('Échec du rafraîchissement du token', result.data || result.error);
    return false;
  }
}

async function testGetProfile() {
  logTest('Obtenir le profil utilisateur');
  
  const result = await makeRequest('GET', '/api/users/profile', null, true);

  if (result.ok && result.data.success) {
    logSuccess(`Profil récupéré: ${result.data.data.email}`);
    return true;
  } else {
    logError('Échec de la récupération du profil', result.data || result.error);
    return false;
  }
}

// ==================== TESTS UTILISATEURS ====================

async function testGetAllUsers() {
  logTest('Obtenir tous les utilisateurs');
  
  const result = await makeRequest('GET', '/api/users?page=0&size=20', null, true);

  if (result.ok && result.data.success) {
    const users = result.data.data.content || [];
    logSuccess(`${users.length} utilisateur(s) récupéré(s)`);
    return true;
  } else {
    logError('Échec de la récupération des utilisateurs', result.data || result.error);
    return false;
  }
}

async function testGetUserStats() {
  logTest('Obtenir les statistiques des utilisateurs');
  
  const result = await makeRequest('GET', '/api/users/stats', null, true);

  if (result.ok && result.data.success) {
    const stats = result.data.data;
    logSuccess(`Stats: Active: ${stats.active}, Inactive: ${stats.inactive}, Pending: ${stats.pending}`);
    return true;
  } else {
    logError('Échec de la récupération des stats', result.data || result.error);
    return false;
  }
}

// ==================== TESTS PROJETS ====================

async function testCreateProject() {
  logTest('Créer un projet');
  
  const projectData = {
    name: `Test Project ${Date.now()}`,
    description: 'Description du projet de test',
    priority: 'HIGH',
    startDate: '2024-01-01',
    dueDate: '2024-12-31',
  };

  const result = await makeRequest('POST', '/api/projects', projectData, true);

  if (result.ok && result.data.success) {
    testProjectId = result.data.data.id;
    logSuccess(`Projet créé avec ID: ${testProjectId}`);
    return true;
  } else {
    logError('Échec de la création du projet', result.data || result.error);
    return false;
  }
}

async function testGetAllProjects() {
  logTest('Obtenir tous les projets');
  
  const result = await makeRequest('GET', '/api/projects?page=0&size=20', null, true);

  if (result.ok && result.data.success) {
    const projects = result.data.data.content || [];
    logSuccess(`${projects.length} projet(s) récupéré(s)`);
    if (projects.length > 0 && !testProjectId) {
      testProjectId = projects[0].id;
      logSuccess(`Projet de test sélectionné: ID ${testProjectId}`);
    }
    return true;
  } else {
    logError('Échec de la récupération des projets', result.data || result.error);
    return false;
  }
}

async function testGetMyProjects() {
  logTest('Obtenir mes projets');
  
  const result = await makeRequest('GET', '/api/projects/my-projects?page=0&size=20', null, true);

  if (result.ok && result.data.success) {
    const projects = result.data.data.content || [];
    logSuccess(`${projects.length} projet(s) personnel(s) récupéré(s)`);
    return true;
  } else {
    logError('Échec de la récupération de mes projets', result.data || result.error);
    return false;
  }
}

async function testGetProjectById() {
  if (!testProjectId) {
    log('Aucun projet disponible pour ce test', 'yellow');
    return false;
  }

  logTest(`Obtenir le projet par ID (${testProjectId})`);
  
  const result = await makeRequest('GET', `/api/projects/${testProjectId}`, null, true);

  if (result.ok && result.data.success) {
    logSuccess(`Projet récupéré: ${result.data.data.name}`);
    return true;
  } else {
    logError('Échec de la récupération du projet', result.data || result.error);
    return false;
  }
}

async function testGetProjectStats() {
  logTest('Obtenir les statistiques des projets');
  
  const result = await makeRequest('GET', '/api/projects/stats', null, true);

  if (result.ok && result.data.success) {
    const stats = result.data.data;
    logSuccess(`Stats: TODO: ${stats.todo}, IN_PROGRESS: ${stats.in_progress}, COMPLETED: ${stats.completed}`);
    return true;
  } else {
    logError('Échec de la récupération des stats projets', result.data || result.error);
    return false;
  }
}

// ==================== TESTS TÂCHES ====================

async function testCreateTask() {
  if (!testProjectId) {
    log('Aucun projet disponible pour créer une tâche', 'yellow');
    return false;
  }

  logTest('Créer une tâche');
  
  const taskData = {
    title: `Test Task ${Date.now()}`,
    description: 'Description de la tâche de test',
    priority: 'MEDIUM',
    projectId: testProjectId,
    dueDate: '2024-12-31',
  };

  const result = await makeRequest('POST', '/api/tasks', taskData, true);

  if (result.ok && result.data.success) {
    testTaskId = result.data.data.id;
    logSuccess(`Tâche créée avec ID: ${testTaskId}`);
    return true;
  } else {
    logError('Échec de la création de la tâche', result.data || result.error);
    return false;
  }
}

async function testGetAllTasks() {
  logTest('Obtenir toutes les tâches');
  
  const result = await makeRequest('GET', '/api/tasks?page=0&size=20', null, true);

  if (result.ok && result.data.success) {
    const tasks = result.data.data.content || [];
    logSuccess(`${tasks.length} tâche(s) récupérée(s)`);
    if (tasks.length > 0 && !testTaskId) {
      testTaskId = tasks[0].id;
      logSuccess(`Tâche de test sélectionnée: ID ${testTaskId}`);
    }
    return true;
  } else {
    logError('Échec de la récupération des tâches', result.data || result.error);
    return false;
  }
}

async function testGetMyTasks() {
  logTest('Obtenir mes tâches');
  
  const result = await makeRequest('GET', '/api/tasks/my-tasks?page=0&size=20', null, true);

  if (result.ok && result.data.success) {
    const tasks = result.data.data.content || [];
    logSuccess(`${tasks.length} tâche(s) personnelle(s) récupérée(s)`);
    return true;
  } else {
    logError('Échec de la récupération de mes tâches', result.data || result.error);
    return false;
  }
}

async function testGetTasksByProject() {
  if (!testProjectId) {
    log('Aucun projet disponible pour ce test', 'yellow');
    return false;
  }

  logTest(`Obtenir les tâches du projet (${testProjectId})`);
  
  const result = await makeRequest('GET', `/api/tasks/project/${testProjectId}?page=0&size=20`, null, true);

  if (result.ok && result.data.success) {
    const tasks = result.data.data.content || [];
    logSuccess(`${tasks.length} tâche(s) du projet récupérée(s)`);
    return true;
  } else {
    logError('Échec de la récupération des tâches du projet', result.data || result.error);
    return false;
  }
}

async function testGetTaskById() {
  if (!testTaskId) {
    log('Aucune tâche disponible pour ce test', 'yellow');
    return false;
  }

  logTest(`Obtenir la tâche par ID (${testTaskId})`);
  
  const result = await makeRequest('GET', `/api/tasks/${testTaskId}`, null, true);

  if (result.ok && result.data.success) {
    logSuccess(`Tâche récupérée: ${result.data.data.title}`);
    return true;
  } else {
    logError('Échec de la récupération de la tâche', result.data || result.error);
    return false;
  }
}

async function testGetTaskStats() {
  logTest('Obtenir les statistiques des tâches');
  
  const result = await makeRequest('GET', '/api/tasks/stats', null, true);

  if (result.ok && result.data.success) {
    const stats = result.data.data;
    logSuccess(`Stats: TODO: ${stats.todo}, IN_PROGRESS: ${stats.in_progress}, COMPLETED: ${stats.completed}`);
    return true;
  } else {
    logError('Échec de la récupération des stats tâches', result.data || result.error);
    return false;
  }
}

// ==================== TESTS FICHIERS ====================

async function testGetFilesByProject() {
  if (!testProjectId) {
    log('Aucun projet disponible pour ce test', 'yellow');
    return false;
  }

  logTest(`Obtenir les fichiers du projet (${testProjectId})`);
  
  const result = await makeRequest('GET', `/api/files/project/${testProjectId}`, null, true);

  if (result.ok && result.data.success) {
    const files = result.data.data || [];
    logSuccess(`${files.length} fichier(s) du projet récupéré(s)`);
    return true;
  } else {
    logError('Échec de la récupération des fichiers', result.data || result.error);
    return false;
  }
}

// ==================== EXECUTION DES TESTS ====================

async function runAllTests() {
  log('\n🚀 DÉMARRAGE DES TESTS API', 'cyan');
  log(`Base URL: ${baseURL}\n`, 'yellow');

  const results = {
    passed: 0,
    failed: 0,
    skipped: 0,
  };

  // Authentification
  if (await testLogin()) results.passed++;
  else { results.failed++; return; }

  if (await testRefreshToken()) results.passed++;
  else results.failed++;

  if (await testGetProfile()) results.passed++;
  else results.failed++;

  // Utilisateurs
  if (await testGetAllUsers()) results.passed++;
  else results.failed++;

  if (await testGetUserStats()) results.passed++;
  else results.failed++;

  // Projets
  if (await testCreateProject()) results.passed++;
  else results.failed++;

  if (await testGetAllProjects()) results.passed++;
  else results.failed++;

  if (await testGetMyProjects()) results.passed++;
  else results.failed++;

  if (await testGetProjectById()) results.passed++;
  else results.skipped++;

  if (await testGetProjectStats()) results.passed++;
  else results.failed++;

  // Tâches
  if (await testCreateTask()) results.passed++;
  else results.skipped++;

  if (await testGetAllTasks()) results.passed++;
  else results.failed++;

  if (await testGetMyTasks()) results.passed++;
  else results.failed++;

  if (await testGetTasksByProject()) results.passed++;
  else results.skipped++;

  if (await testGetTaskById()) results.passed++;
  else results.skipped++;

  if (await testGetTaskStats()) results.passed++;
  else results.failed++;

  // Fichiers
  if (await testGetFilesByProject()) results.passed++;
  else results.skipped++;

  // Résumé
  log('\n' + '='.repeat(60), 'cyan');
  log('RÉSUMÉ DES TESTS', 'blue');
  log('='.repeat(60), 'cyan');
  log(`✓ Tests réussis: ${results.passed}`, 'green');
  log(`✗ Tests échoués: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`⊘ Tests ignorés: ${results.skipped}`, 'yellow');
  log('='.repeat(60) + '\n', 'cyan');
}

// Exécuter les tests
runAllTests().catch(error => {
  logError('Erreur fatale', error);
  process.exit(1);
});

