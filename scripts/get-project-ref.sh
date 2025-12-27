#!/bin/bash

# Extract project ref from Supabase URL in .env.local
if [ -f .env.local ]; then
  SUPABASE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" .env.local | cut -d '=' -f2 | tr -d '"' | tr -d "'")
  if [ ! -z "$SUPABASE_URL" ]; then
    # Extract project ref from URL format: https://xxxxx.supabase.co
    PROJECT_REF=$(echo "$SUPABASE_URL" | sed -E 's|https://([^.]+)\.supabase\.co.*|\1|')
    echo "Project Ref: $PROJECT_REF"
    echo ""
    echo "To link your project, run:"
    echo "supabase link --project-ref $PROJECT_REF"
  else
    echo "Could not find NEXT_PUBLIC_SUPABASE_URL in .env.local"
  fi
else
  echo ".env.local file not found"
fi

