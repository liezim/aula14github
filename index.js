document.getElementById('fetchButton').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const userInfoDiv = document.getElementById('userInfo');
    const avatar = document.getElementById('avatar');
    const name = document.getElementById('name');
    const bio = document.getElementById('bio');
    const repoList = document.getElementById('repoList');

    if (username) {
        
        avatar.style.display = 'none';
        name.textContent = '';
        bio.textContent = '';
        repoList.innerHTML = '';

        fetch(`https://api.github.com/users/${username}`)
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Not Found') {
                    alert('Usuário não encontrado');
                    userInfoDiv.style.display = 'none';
                } else {
                    
                    avatar.src = data.avatar_url;
                    avatar.style.display = 'block';
                    name.textContent = data.name || 'Nome não disponível';
                    bio.textContent = data.bio || 'Biografia não disponível';
                    userInfoDiv.style.display = 'block';

                    
                    fetch(data.repos_url)
                        .then(response => response.json())
                        .then(repos => {
                            if (repos.length > 0) {                                
                                repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                                repos.forEach(repo => {
                                    const listItem = document.createElement('li');
                                    const link = document.createElement('a');
                                    link.href = repo.html_url;
                                    link.textContent = repo.name;
                                    link.target = '_blank';
                                    listItem.appendChild(link);
                                    repoList.appendChild(listItem);
                                });
                            } else {
                                repoList.innerHTML = '<li>Este usuário não tem repositórios públicos.</li>';
                            }
                        })
                        .catch(error => {
                            console.error('Erro ao buscar repositórios:', error);
                            repoList.innerHTML = '<li>Não foi possível carregar os repositórios.</li>';
                        });
                }
            })
            .catch(error => {
                console.error('Erro ao buscar dados do usuário:', error);
                alert('Ocorreu um erro. Por favor, tente novamente.');
                userInfoDiv.style.display = 'none';
            });
    } else {
        alert('Por favor, digite um nome de usuário.');
    }
});