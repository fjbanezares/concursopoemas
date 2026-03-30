/**
 * Frontend Logic for Concurso Poético
 */

document.addEventListener('DOMContentLoaded', () => {
    loadPoems();

    const poemForm = document.getElementById('poem-form');
    const feedback = document.getElementById('feedback');
    const adminModal = document.getElementById('admin-modal');
    const adminPassInput = document.getElementById('admin-pass');
    const revealBtn = document.getElementById('reveal-btn');
    const adminResults = document.getElementById('admin-results');

    // --- Poem Submission ---
    poemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const poetName = document.getElementById('poet-name').value;
        const poemText = document.getElementById('poem-text').value;
        const submitBtn = document.getElementById('submit-btn');

        // Loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Inmortalizando...';
        feedback.classList.add('hidden');

        try {
            const response = await fetch('/api/poems', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: poetName, poem: poemText })
            });

            const result = await response.json();

            if (response.ok) {
                feedback.innerHTML = `¡Éxito! Tu clave de participación es: <strong>${result.clave}</strong>. <br> Guárdala para identificarte si ganas.`;
                feedback.className = 'success';
                feedback.classList.remove('hidden');
                poemForm.reset();
                loadPoems(); // Reload list
            } else {
                throw new Error(result.message || 'Error al guardar el poema');
            }
        } catch (error) {
            feedback.textContent = 'Hubo un problema: ' + error.message;
            feedback.className = 'error';
            feedback.classList.remove('hidden');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Gritar al Silencio';
        }
    });

    // --- Load Poems ---
    async function loadPoems() {
        const grid = document.getElementById('poems-grid');
        
        try {
            const response = await fetch('/api/poems');
            const poems = await response.json();

            if (poems.length === 0) {
                grid.innerHTML = '<div class="no-poems animate-fade-in">El silencio es absoluto. Sé el primero en romperlo.</div>';
                return;
            }

            grid.innerHTML = poems.map(p => `
                <div class="poem-card glass-card animate-fade-in">
                    <p class="poem-content">"${p.poema}"</p>
                    <div class="poem-meta">
                        <span class="poet-label">Anónimo</span>
                        <span class="poet-id" title="Clave de Identificación">${p.clave}</span>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            grid.innerHTML = '<div class="error">Error conectando con el oráculo de los poetas.</div>';
        }
    }

    // --- Admin Logic ---
    window.addEventListener('hashchange', () => {
        if (location.hash === '#admin-access') {
            adminModal.classList.remove('hidden');
        }
    });

    window.closeAdmin = () => {
        adminModal.classList.add('hidden');
        location.hash = '';
        adminResults.classList.add('hidden');
    };

    revealBtn.addEventListener('click', async () => {
        const password = adminPassInput.value;
        
        revealBtn.disabled = true;
        revealBtn.textContent = 'Des-velando...';

        try {
            const response = await fetch('/api/admin/reveal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (response.ok) {
                adminResults.innerHTML = `
                    <h3>Registros Secretos</h3>
                    <div class="result-header result-row">
                        <strong>Clave</strong>
                        <strong>Autor Real</strong>
                    </div>
                    ${data.results.map(r => `
                        <div class="result-row">
                            <span class="poet-id">${r.clave}</span>
                            <span>${r.poeta_nombre}</span>
                        </div>
                    `).join('')}
                `;
                adminResults.classList.remove('hidden');
            } else {
                alert('Clave Maestra Incorrecta');
            }
        } catch (error) {
            alert('Error identificando autores');
        } finally {
            revealBtn.disabled = false;
            revealBtn.textContent = 'Abrir el Velo';
        }
    });
});
