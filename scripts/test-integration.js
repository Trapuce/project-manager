#!/usr/bin/env node

/**
 * Script de test pour vérifier l'intégration avec le backend Spring Boot
 * Usage: node scripts/test-integration.js
 */

const API_BASE_URL = 'http://localhost:8080'

async function testEndpoint(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (data) {
      options.body = JSON.stringify(data)
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function runTests() {
  console.log('🧪 Test d\'intégration avec le backend Spring Boot\n')
  console.log(`📍 URL de base: ${API_BASE_URL}\n`)

  const tests = [
    {
      name: 'Test de connexion du serveur',
      endpoint: '/api/auth/register',
      method: 'POST',
      data: {
        email: 'test@example.com',
        password: 'testpassword123',
        firstName: 'Test',
        lastName: 'User',
        role: 'MEMBER'
      }
    },
    {
      name: 'Test de connexion utilisateur',
      endpoint: '/api/auth/login',
      method: 'POST',
      data: {
        email: 'test@example.com',
        password: 'testpassword123'
      }
    },
    {
      name: 'Test des statistiques des projets',
      endpoint: '/api/projects/stats'
    },
    {
      name: 'Test des statistiques des tâches',
      endpoint: '/api/tasks/stats'
    },
    {
      name: 'Test des statistiques des utilisateurs',
      endpoint: '/api/users/stats'
    }
  ]

  let passedTests = 0
  let totalTests = tests.length

  for (const test of tests) {
    console.log(`🔍 ${test.name}...`)
    
    const result = await testEndpoint(test.endpoint, test.method, test.data)
    
    if (result.success) {
      console.log(`✅ ${test.name} - SUCCÈS`)
      if (test.name.includes('connexion') && result.data.data?.accessToken) {
        console.log(`   Token reçu: ${result.data.data.accessToken.substring(0, 20)}...`)
      }
      passedTests++
    } else {
      console.log(`❌ ${test.name} - ÉCHEC`)
      console.log(`   Erreur: ${result.error}`)
    }
    console.log('')
  }

  console.log('📊 Résultats des tests:')
  console.log(`   Tests réussis: ${passedTests}/${totalTests}`)
  console.log(`   Taux de réussite: ${Math.round((passedTests / totalTests) * 100)}%`)

  if (passedTests === totalTests) {
    console.log('\n🎉 Tous les tests sont passés ! L\'intégration est fonctionnelle.')
  } else {
    console.log('\n⚠️  Certains tests ont échoué. Vérifiez que le backend est démarré.')
  }
}

// Vérifier si fetch est disponible (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ Ce script nécessite Node.js 18+ ou l\'installation de node-fetch')
  process.exit(1)
}

runTests().catch(console.error)
