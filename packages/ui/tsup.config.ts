import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"], // O arquivo principal que vamos criar
  format: ["cjs", "esm"],  // Gera formatos antigos e novos
  dts: true,               // Gera os tipos TypeScript
  sourcemap: true,         // Ajuda no debug
  clean: true,             // Limpa a pasta antes de gerar
  // O tsup vai detectar o CSS Modules nativo e gerar o arquivo final
});