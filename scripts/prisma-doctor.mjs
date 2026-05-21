import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const sourceSchema = path.join(root, 'prisma', 'schema.prisma');
const generatedSchema = path.join(root, 'node_modules', '.prisma', 'client', 'schema.prisma');
const generatedTypes = path.join(root, 'node_modules', '.prisma', 'client', 'index.d.ts');

function readFileOrNull(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

const source = readFileOrNull(sourceSchema);
const generated = readFileOrNull(generatedSchema);
const generatedTypeDefs = readFileOrNull(generatedTypes);

if (!source) {
  console.error('Prisma doctor: source schema not found at prisma/schema.prisma');
  process.exit(1);
}

if (!generated) {
  console.error('Prisma doctor: generated client schema not found in node_modules/.prisma/client/schema.prisma');
  console.error('Run `npx prisma generate` after installing dependencies.');
  process.exit(1);
}

if (!generatedTypeDefs) {
  console.error('Prisma doctor: generated Prisma type definitions not found in node_modules/.prisma/client/index.d.ts');
  process.exit(1);
}

const requiredSchemaTokens = ['bio', 'reviewPriority', 'reviewDueAt', 'reviewStartedAt', 'statusChangedAt', '@@unique([userId, entryId])'];
const requiredTypeTokens = ['bio', 'reviewPriority', 'reviewDueAt', 'reviewStartedAt', 'statusChangedAt', 'userId_entryId'];

const missingSchemaTokens = requiredSchemaTokens.filter((token) => !generated.includes(token));
const missingTypeTokens = requiredTypeTokens.filter((token) => !generatedTypeDefs.includes(token));

if (missingSchemaTokens.length > 0 || missingTypeTokens.length > 0) {
  console.error('Prisma doctor: generated Prisma client is missing expected schema features');
  if (missingSchemaTokens.length > 0) {
    console.error(`Missing schema tokens: ${missingSchemaTokens.join(', ')}`);
  }
  if (missingTypeTokens.length > 0) {
    console.error(`Missing type tokens: ${missingTypeTokens.join(', ')}`);
  }
  process.exit(1);
}

console.log('Prisma doctor: generated client contains the expected schema features');
