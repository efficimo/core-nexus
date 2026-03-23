#!/bin/sh

HOOK=".git/hooks/pre-commit"

cat > "$HOOK" << 'EOF'
#!/bin/sh

echo "pre-commit: biome check..."
npm run check --silent
if [ $? -ne 0 ]; then
  echo ""
  echo "COMMIT BLOQUE: biome check a echoue."
  echo "Lancez 'npm run check:fix' puis recommitez."
  exit 1
fi

echo "pre-commit: verification des fichiers de data..."
npm run data:verify --silent
if [ $? -ne 0 ]; then
  echo ""
  echo "COMMIT BLOQUE: les fichiers .json.enc ne sont pas a jour."
  echo "Lancez 'npm run data:encrypt' puis recommitez."
  exit 1
fi
EOF

chmod +x "$HOOK"
echo "Hook pre-commit installe."