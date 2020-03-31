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

Then create a `.env` file

```console
$ touch .env
```

Update the `.env` file with information about your Kubernetes setup

```
# .env
KUBERNETES_ENDPOINT=https://cluster.example.com
KUBERNETES_PORT=6443
KUBERNETES_SERVICE_ACCOUNT_TOKEN=xxxx
KUBERNETES_SKIP_TLS_VERIFY=false
```

### 3. Configure

```yml
# serverless.yml
org: acme
app: todo
name: todo-kubernetes-namespace

component: kubernetes-namespace@dev

inputs:
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
