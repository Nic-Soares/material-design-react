import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head />
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
