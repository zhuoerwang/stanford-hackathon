#!/bin/bash
# Run this ONCE to set up Google Cloud permissions
set -e

PROJECT_ID="deepmind-hackathon-486201"

echo "Setting project..."
gcloud config set project $PROJECT_ID

echo "Getting project number..."
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

echo "Granting IAM permissions to default service account..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/cloudbuild.builds.builder" \
  --quiet

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/storage.admin" \
  --quiet

echo "Enabling required APIs..."
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com --quiet

echo "Setup complete! Now run ./deploy.sh"
