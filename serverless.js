const path = require('path')
const { isEmpty, mergeDeepRight } = require('ramda')
const kubernetes = require('@kubernetes/client-node')
const { Component } = require('@serverless/core')

const defaults = {
  kubeConfigPath: path.join(process.env.HOME, '.kube', 'config'),
  name: 'default',
  labels: null
}

class KubernetesNamespace extends Component {
  async default(inputs = {}) {
    const config = mergeDeepRight(defaults, inputs)

    const k8sCore = this.getKubernetesClient(config.kubeConfigPath, kubernetes.CoreV1Api)

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
    await this.save()
    return this.state
  }

  async remove(inputs = {}) {
    let config = mergeDeepRight(defaults, inputs)
    if (isEmpty(config)) {
      config = this.state
    }

    const k8sCore = this.getKubernetesClient(config.kubeConfigPath, kubernetes.CoreV1Api)

    await this.deleteNamespace(k8sCore, config)

    this.state = {}
    await this.save()
    return {}
  }

  // "private" methods
  getKubernetesClient(configPath, type) {
    let kc = new kubernetes.KubeConfig()
    kc.loadFromFile(configPath)
    kc = kc.makeApiClient(type)
    return kc
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
