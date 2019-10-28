# kubernetes-namespace

Instantly create, update and remove Kubernetes namespaces with [Serverless Components](https://github.com/serverless/components).

&nbsp;

1. [Install](#1-install)
2. [Create](#2-create)
3. [Configure](#3-configure)
4. [Deploy](#4-deploy)

&nbsp;

### 1. Install

```console
$ npm install -g serverless
```

### 2. Create

Just create a `serverless.yml` file

```console
$ touch serverless.yml
```

Make sure that you have generated your [`Kubeconfig` file](https://rancher.com/docs/rancher/v2.x/en/cluster-admin/kubeconfig/) via `kubectl`.

### 3. Configure

```yml
# serverless.yml

myKubernetesNamespace:
  component: '@serverless/kubernetes-namespace'
  inputs:
    kubeConfigPath: ../kubeconfig # default is `~/.kube/config`
    name: 'default' # default is `'default'`
    labels: # default is `null`
      foo: bar
      baz: qux
```

### 4. Deploy

```console
$ serverless
```

### New to Components?

Checkout the [Serverless Components](https://github.com/serverless/components) repo for more information.
