const kubernetes = require('@kubernetes/client-node')
const { Component } = require('@serverless/core')

const defaults = {
  name: 'default',
  labels: null
}

class KubernetesNamespace extends Component {
  async deploy(inputs = {}) {
    const config = {
      ...defaults,
      ...inputs
    }

    const k8sCore = this.getKubernetesClient(kubernetes.CoreV1Api)

    let namespaceExists = true
    try {
      await this.readNamespace(k8sCore, config)
    } catch (error) {
      namespaceExists = error.response.body.code === 404 ? false : true
    }

    if (!namespaceExists) {
      await this.createNamespace(k8sCore, config)
    }

    this.state = config
    return this.state
  }

  async remove(inputs = {}) {
    const config = {
      ...defaults,
      ...inputs,
      ...this.state
    }

    const k8sCore = this.getKubernetesClient(kubernetes.CoreV1Api)

    await this.deleteNamespace(k8sCore, config)

    this.state = {}
    return {}
  }

  // "private" methods
  getKubernetesClient(type) {
    const { endpoint, port } = this.credentials.kubernetes
    const token = this.credentials.kubernetes.serviceAccountToken
    const skipTLSVerify = this.credentials.kubernetes.skipTlsVerify ? true : false
    const kc = new kubernetes.KubeConfig()
    kc.loadFromOptions({
      clusters: [
        {
          name: 'cluster',
          skipTLSVerify,
          server: `${endpoint}:${port}`
        }
      ],
      users: [{ name: 'user', token }],
      contexts: [
        {
          name: 'context',
          user: 'user',
          cluster: 'cluster'
        }
      ],
      currentContext: 'context'
    })
    return kc.makeApiClient(type)
  }

  async createNamespace(k8s, { name, labels }) {
    return k8s.createNamespace({ metadata: { name, labels } })
  }

  async readNamespace(k8s, { name }) {
    return k8s.readNamespace(name)
  }

  async deleteNamespace(k8s, { name }) {
    return k8s.deleteNamespace(name)
  }
}

module.exports = KubernetesNamespace
