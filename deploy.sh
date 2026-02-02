#!/bin/bash
# Run this to deploy (can run multiple times)
set -e

PROJECT_ID="deepmind-hackathon-486201"
REGION="us-central1"
SERVICE_NAME="trialmatch"

echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --project $PROJECT_ID \
  --source . \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "VOCAL_BRIDGE_API_KEY=vb_zMfXVX-D9ZLNpWP8PYtx87pLuVt2_KpugbJzRQETZ0A"

echo "Deployment complete!"
