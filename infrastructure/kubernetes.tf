resource "kubernetes_deployment" "app" {
  metadata {
    name = var.app_name
    labels = {
      app = var.app_name
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = var.app_name
      }
    }

    template {
      metadata {
        labels = {
          app = var.app_name
        }
      }

      spec {
        container {
          name  = var.app_name
          image = "${aws_ecr_repository.app_image.repository_url}:latest"

          env {
            name  = "PORT"
            value = "80"
          }

          env {
            name  = "MAXMIND_DB_URL"
            value = "https://alo-geo-distribution.nyc3.digitaloceanspaces.com/GeoLite2-City.tar.gz"
          }
          env {
            name  = "EXCHANGE_RATES_URL"
            value = "https://alo-geo-distribution.nyc3.digitaloceanspaces.com/exchangeRates.json"
          }

          env {
            name  = "ORIGIN_WHITELIST"
            value = "https://www.aloyoga.com https://aloyoga.com https://alo-yoga.myshopify.com https://devaloyoga.myshopify.com https://dev2aloyoga.myshopify.com"
          }
        }
      }
    }
  }

  timeouts {
    create = "3m"
  }

  depends_on = [
    null_resource.push_image
  ]
}

resource "kubernetes_service" "app_service" {
  metadata {
    name = "${var.app_name}-service"
  }
  spec {
    selector = {
      app = kubernetes_deployment.app.metadata[0].labels.app
    }
    session_affinity = "ClientIP"
    port {
      port        = 80
      target_port = 80
    }

    type = "ClusterIP"
  }
}

resource "kubernetes_ingress" "app_ingress" {
  metadata {
    name = "${var.app_name}-ingress"
    annotations = {
      "kubernetes.io/ingress.class"                 = "nginx"
      "nginx.ingress.kubernetes.io/ssl-redirect"    = "false"
      "nginx.ingress.kubernetes.io/rewrite-target"  = "/$1"
      "nginx.ingress.kubernetes.io/proxy-body-size" = "20m"
    }
  }

  spec {
    rule {
      http {
        path {
          path = "/${var.app_name}/(.*)"
          backend {
            service_name = kubernetes_service.app_service.metadata[0].name
            service_port = kubernetes_service.app_service.spec[0].port[0].port
          }
        }
      }
    }
  }
}

resource "kubernetes_ingress" "host_ingress" {
  metadata {
    name = "${var.app_name}-host-ingress"
    annotations = {
      "cert-manager.io/cluster-issuer" = "letsencrypt-prod"
    }
  }

  spec {
    tls {
      hosts = ["geo.andrewchan.pw"]
      secret_name = "geo-tls"
    }
    rule {
      host = "geo.andrewchan.pw"
      http {
        path {
          backend {
            service_name = kubernetes_service.app_service.metadata[0].name
            service_port = kubernetes_service.app_service.spec[0].port[0].port
          }
        }
      }
    }
  }
}

