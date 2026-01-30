
const BASE_URL = 'http://localhost:3000';

async function testSecurity() {
    console.log('🛡️ INICIANDO TEST DE SEGURIDAD 🛡️\n');

    // 1. Test Public Endpoint
    try {
        const res = await fetch(`${BASE_URL}/api/reports`);
        console.log(`[1] Acceso Público (/api/reports): ${res.status === 200 ? '✅ OK' : '❌ FALLÓ'} (Status: ${res.status})`);
    } catch (e) {
        console.log(`[1] Acceso Público: ❌ ERROR DE CONEXIÓN (El servidor parece apagado)`);
        return;
    }

    // 2. Test Unprotected Upload (Should Fail)
    try {
        const res = await fetch(`${BASE_URL}/api/reports`, {
            method: 'POST',
            body: JSON.stringify({ data: 'fake' }),
            headers: { 'Content-Type': 'application/json' }
        });
        console.log(`[2] Subida sin Token: ${res.status === 401 ? '✅ BLOQUEADO (Correcto)' : '❌ PERMITIDO (Peligro)'} (Status: ${res.status})`);
    } catch (e) {
        console.log(`[2] Error en test:`, e.message);
    }

    // 3. Test Invalid Token (Should Fail)
    try {
        const res = await fetch(`${BASE_URL}/api/reports`, {
            method: 'POST',
            body: JSON.stringify({ data: 'fake' }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer TOKEN_FALSO_123'
            }
        });
        console.log(`[3] Subida con Token Falso: ${res.status === 403 ? '✅ BLOQUEADO (Correcto)' : '❌ PERMITIDO (Peligro)'} (Status: ${res.status})`);
    } catch (e) {
        console.log(`[3] Error en test:`, e.message);
    }

    // 4. Test Rate Limiting (Login)
    console.log(`\n[4] Testeando Rate Limit de Login (5 intentos permitidos)...`);
    for (let i = 1; i <= 7; i++) {
        const res = await fetch(`${BASE_URL}/api/login`, {
            method: 'POST',
            body: JSON.stringify({ password: 'wrong' }),
            headers: { 'Content-Type': 'application/json' }
        });

        let statusIcon = res.status === 429 ? '🛑 BLOQUEADO (Rate Limit Funciona)' : 'Permitido';
        if (i > 5 && res.status !== 429) statusIcon = '❌ FALLÓ (Debería estar bloqueado)';

        console.log(`   Intento ${i}: Status ${res.status} - ${statusIcon}`);
    }
}

testSecurity();
