#!/bin/bash

# Smart Budget - Script de gestion Docker
# Utilisation: ./budget.sh [start|stop|status|restart|logs]

BUDGET_DIR="/Users/jules/budget-app"

case "$1" in
    start)
        echo "🚀 Démarrage de Smart Budget..."
        cd "$BUDGET_DIR"
        docker-compose up -d
        echo "✅ Application démarrée !"
        echo "🌐 Accès: http://localhost"
        echo "📊 Backend: http://localhost:3000"
        ;;
    stop)
        echo "🛑 Arrêt de Smart Budget..."
        cd "$BUDGET_DIR"
        docker-compose down
        echo "✅ Application arrêtée"
        ;;
    status)
        echo "📊 État des services:"
        cd "$BUDGET_DIR"
        docker-compose ps
        ;;
    restart)
        echo "🔄 Redémarrage de Smart Budget..."
        cd "$BUDGET_DIR"
        docker-compose restart
        echo "✅ Application redémarrée"
        ;;
    logs)
        echo "📝 Logs des services:"
        cd "$BUDGET_DIR"
        docker-compose logs -f --tail=50
        ;;
    *)
        echo "Usage: $0 {start|stop|status|restart|logs}"
        echo ""
        echo "Commandes:"
        echo "  start   - Démarrer l'application"
        echo "  stop    - Arrêter l'application"
        echo "  status  - Voir l'état des services"
        echo "  restart - Redémarrer l'application"
        echo "  logs    - Voir les logs en temps réel"
        exit 1
        ;;
esac