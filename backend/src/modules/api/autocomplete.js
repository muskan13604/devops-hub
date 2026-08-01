const Trie = require('../../shared/data-structures/Trie');

class AutocompleteService {
  constructor() {
    this.dockerTrie = new Trie();
    this.kubectlTrie = new Trie();
    this.repoTrie = new Trie();

    this._initializeDockerCommands();
    this._initializeKubectlCommands();
  }

  _initializeDockerCommands() {
    const commands = [
      'docker run', 'docker build', 'docker pull', 'docker push',
      'docker images', 'docker ps', 'docker rm', 'docker rmi',
      'docker exec', 'docker logs', 'docker network', 'docker volume',
      'docker compose up', 'docker compose down'
    ];
    commands.forEach(cmd => this.dockerTrie.insert(cmd));
  }

  _initializeKubectlCommands() {
    const commands = [
      'kubectl get pods', 'kubectl get nodes', 'kubectl get services',
      'kubectl get deployments', 'kubectl describe pod',
      'kubectl apply -f', 'kubectl delete -f', 'kubectl logs',
      'kubectl exec -it', 'kubectl port-forward'
    ];
    commands.forEach(cmd => this.kubectlTrie.insert(cmd));
  }

  // Allow dynamic addition of repositories
  addRepository(repoName) {
    this.repoTrie.insert(repoName);
  }

  suggestDockerCommands(prefix) {
    return this.dockerTrie.getAutocompleteSuggestions(prefix);
  }

  suggestKubectlCommands(prefix) {
    return this.kubectlTrie.getAutocompleteSuggestions(prefix);
  }

  suggestRepositories(prefix) {
    return this.repoTrie.getAutocompleteSuggestions(prefix);
  }
}

module.exports = new AutocompleteService();
