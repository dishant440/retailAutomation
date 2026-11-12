#!/usr/bin/env bash
set -e

# Base directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

# Text formatters
BOLD="\033[1m"
GREEN="\033[0;32m"
BLUE="\033[0;34m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m"

ensure_seed_data() {
    if [ ! -d "$ROOT_DIR/pumpiot_api/docker/db_data" ] || [ -z "$(ls -A "$ROOT_DIR/pumpiot_api/docker/db_data" 2>/dev/null)" ]; then
        if [ -f "$ROOT_DIR/pumpiot_api/docker/db_seed.tar.gz" ]; then
            echo -e "${YELLOW}Initial database volume empty. Unpacking seed data...${NC}"
            mkdir -p "$ROOT_DIR/pumpiot_api/docker"
            tar -xzf "$ROOT_DIR/pumpiot_api/docker/db_seed.tar.gz" -C "$ROOT_DIR/pumpiot_api/docker/"
            echo -e "${GREEN}Database seed unpacked successfully.${NC}"
        fi
    fi
}

start_docker() {
    echo -e "${BLUE}${BOLD}Starting Retail Automation stack with Docker...${NC}"
    ensure_seed_data

    docker compose up -d --build

    echo ""
    echo -e "${GREEN}${BOLD}Stack is up and running!${NC}"
    echo -e "--------------------------------------------------------"
    echo -e "  ${BOLD}Frontend Web App:${NC}       ${BLUE}http://localhost:3001${NC}"
    echo -e "  ${BOLD}Backend API:${NC}            ${BLUE}http://localhost:5001/api${NC}"
    echo -e "  ${BOLD}RethinkDB Web Admin:${NC}    ${BLUE}http://localhost:8085${NC}"
    echo -e "--------------------------------------------------------"
    echo -e "  ${BOLD}Credentials:${NC}            Username: ${YELLOW}admin${NC} | Password: ${YELLOW}admin123${NC}"
    echo -e "--------------------------------------------------------"
    echo -e "To view live logs:   ${YELLOW}./run.sh logs${NC}"
    echo -e "To stop services:    ${YELLOW}./run.sh stop${NC}"
}

stop_docker() {
    echo -e "${YELLOW}Stopping all services...${NC}"
    docker compose down
    echo -e "${GREEN}All services stopped successfully.${NC}"
}

status_docker() {
    echo -e "${BLUE}${BOLD}Checking service status:${NC}"
    docker compose ps
}

logs_docker() {
    SERVICE="${1:-}"
    if [ -n "$SERVICE" ]; then
        docker compose logs -f "$SERVICE"
    else
        docker compose logs -f
    fi
}

start_local() {
    echo -e "${BLUE}${BOLD}Starting in local development mode (RethinkDB in Docker, API & App natively)...${NC}"
    ensure_seed_data

    # Start RethinkDB
    docker compose up -d db

    # Check NVM
    if [ -s "$HOME/.nvm/nvm.sh" ]; then
        source "$HOME/.nvm/nvm.sh"
        nvm use 16 || nvm use 14 || true
    fi

    echo -e "${GREEN}RethinkDB running on ports 28015 (driver) and 8085 (admin).${NC}"
    echo -e "${YELLOW}To run API locally in a terminal:${NC}"
    echo -e "  cd pumpiot_api/api && node server.js"
    echo -e "${YELLOW}To run App locally in a terminal:${NC}"
    echo -e "  cd pumpiot_app && PORT=3001 yarn start"
}

usage() {
    echo -e "${BOLD}Usage:${NC} ./run.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start       Build and start the complete application in Docker (default)"
    echo "  stop        Stop all running containers"
    echo "  restart     Restart all containers"
    echo "  status      Show status of services"
    echo "  logs [svc]  View live container logs (optionally specify db, api, or app)"
    echo "  local       Start RethinkDB in Docker and print local Node launch commands"
    echo "  help        Display this help message"
}

CMD="${1:-start}"
shift || true

case "$CMD" in
    start)
        start_docker
        ;;
    stop)
        stop_docker
        ;;
    restart)
        stop_docker
        start_docker
        ;;
    status)
        status_docker
        ;;
    logs)
        logs_docker "$@"
        ;;
    local)
        start_local
        ;;
    help|--help|-h)
        usage
        ;;
    *)
        echo -e "${RED}Unknown command: $CMD${NC}"
        usage
        exit 1
        ;;
esac

