import { useState } from 'react'
import './index.css'
import logo from './assets/logo.svg'

const COMMANDS = [
  { cmd: 'versioner init',        desc: 'Inicializa o Versioner no projeto',           example: 'versioner init --yes' },
  { cmd: 'versioner build "msg"', desc: 'Incrementa Build e publica a release',        example: 'versioner build "Corrige login"' },
  { cmd: 'versioner minor "msg"', desc: 'Incrementa Minor e Build',                    example: 'versioner minor "Nova feature"' },
  { cmd: 'versioner major "msg"', desc: 'Incrementa Major, zera Minor',               example: 'versioner major "Reescrita da API"' },
  { cmd: 'versioner log',         desc: 'Lista commits recentes',                      example: 'versioner log --limit=30' },
  { cmd: 'versioner sync',        desc: 'Sincroniza versão em todos os arquivos',      example: 'versioner sync' },
  { cmd: 'versioner status',      desc: 'Mostra versão e estado do Git',               example: 'versioner status' },
  { cmd: 'versioner changelog',   desc: 'Gera ou atualiza o CHANGELOG.md',            example: 'versioner changelog' },
  { cmd: 'versioner pull',        desc: 'Atualiza o repositório local',               example: 'versioner pull --merge' },
]

const FLAGS = [
  { flag: '--no-push',      desc: 'Commit sem enviar para o remoto',        example: 'versioner build "msg" --no-push' },
  { flag: '--force-push',   desc: 'Push forçado após um reset manual',      example: 'versioner build "msg" --force-push' },
  { flag: '--no-git',       desc: 'Só versiona arquivos, ignora Git',       example: 'versioner build "msg" --no-git' },
  { flag: '--no-version',   desc: 'Fluxo Git sem incrementar versão',       example: 'versioner build "Docs" --no-version' },
  { flag: '--dry-run',      desc: 'Simula tudo sem gravar nada',            example: 'versioner build "msg" --dry-run' },
  { flag: '--changelog',    desc: 'Gera CHANGELOG antes do commit',         example: 'versioner build "msg" --changelog' },
  { flag: '--tag',          desc: 'Cria tag Git para a release',            example: 'versioner build "msg" --tag' },
]

const ALIASES = [
  { alias: 'b',  full: 'build',     example: 'versioner b "Corrige bug"' },
  { alias: 'm',  full: 'minor',     example: 'versioner m "Nova feature"' },
  { alias: 'M',  full: 'major',     example: 'versioner M "Breaking change"' },
  { alias: 'i',  full: 'init',      example: 'versioner i' },
  { alias: 'lg', full: 'log',       example: 'versioner lg --limit=10' },
  { alias: 'sy', full: 'sync',      example: 'versioner sy' },
  { alias: 'cl', full: 'changelog', example: 'versioner cl' },
  { alias: 'v',  full: 'version',   example: 'versioner v' },
  { alias: 's',  full: 'status',    example: 'versioner s' },
  { alias: 'p',  full: 'pull',      example: 'versioner p' },
]

const STEPS = [
  { n: '01', title: 'Instale',    body: 'Uma linha e o CLI está disponível globalmente no sistema.' },
  { n: '02', title: 'Inicialize', body: 'O init detecta package.json, app.json e cria os arquivos de controle.' },
  { n: '03', title: 'Release',    body: 'Um comando versiona os arquivos, commita e faz push automaticamente.' },
]

function Tooltip({ text, children }) {
  const [visible, setVisible] = useState(false)
  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span className="absolute z-50 left-0 bottom-full mb-2 px-3 py-2 rounded-lg bg-[#0e0b1e] border border-[#3d2d70] text-xs font-mono text-[#c4b5fd] whitespace-nowrap shadow-xl pointer-events-none">
          <span className="text-[#4b5563] mr-1">$</span>{text}
        </span>
      )}
    </span>
  )
}

function CodeBlock({ children, copy }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(copy || children)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="rounded-xl bg-[#13101f] border border-[#2d2550] overflow-hidden">
      {copy !== undefined && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#2d2550]">
          <span className="text-xs font-mono text-[#4b5563]">bash</span>
          <button
            onClick={handleCopy}
            className="text-xs font-mono px-2 py-0.5 rounded text-[#6b7280] hover:text-[#a78bfa] transition-colors"
          >
            {copied ? '✓ copiado' : 'copiar'}
          </button>
        </div>
      )}
      <pre className="p-5 text-sm font-mono text-[#c4b5fd] overflow-x-auto leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  )
}

function Section({ id, children, className = '' }) {
  return (
    <section id={id} className={`px-6 py-24 max-w-5xl mx-auto ${className}`}>
      {children}
    </section>
  )
}

function SectionTitle({ tag, children }) {
  return (
    <div className="mb-12">
      {tag && (
        <span className="inline-block mb-3 text-xs font-mono font-semibold tracking-[0.2em] uppercase text-[#7c3aed] bg-[#7c3aed]/10 border border-[#7c3aed]/30 rounded-full px-3 py-1">
          {tag}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold text-white">{children}</h2>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0f0f1a]/80 backdrop-blur-md border-b border-[#2d2550]/60">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Versioner" className="w-8 h-8" />
          <span className="font-mono font-semibold text-[#a78bfa] tracking-wide">versioner</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#como-funciona" className="text-sm text-[#6b7280] hover:text-white transition-colors hidden sm:block">Como funciona</a>
          <a href="#comandos"      className="text-sm text-[#6b7280] hover:text-white transition-colors hidden sm:block">Comandos</a>
          <a href="#instalacao"   className="text-sm text-[#6b7280] hover:text-white transition-colors hidden sm:block">Instalação</a>
          <a href="#cli"          className="text-sm text-[#6b7280] hover:text-white transition-colors hidden sm:block">CLI interativo</a>
          <a
            href="https://www.npmjs.com/package/@kinetnode/versioner"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 text-sm font-mono font-medium bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-lg transition-colors"
          >
            npm ↗
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#7c3aed]/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-[#4c1d95]/20 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-8 max-w-3xl">
          <img src={logo} alt="Versioner" className="w-24 h-24 drop-shadow-[0_0_30px_rgba(124,58,237,0.6)]" />

          <div>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
              <span className="text-white">Release em </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] to-[#7c3aed]">
                um comando
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-[#9ca3af] max-w-xl mx-auto leading-relaxed">
              CLI que substitui o fluxo manual de versionamento por um único comando.
              Versiona arquivos, commita e faz push automaticamente.
            </p>
          </div>

          <CodeBlock copy="npm install -g @kinetnode/versioner">
            npm install -g @kinetnode/versioner
          </CodeBlock>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a
              href="#como-funciona"
              className="px-6 py-3 font-semibold bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl transition-colors"
            >
              Ver como funciona
            </a>
            <a
              href="#instalacao"
              className="px-6 py-3 font-semibold border border-[#2d2550] hover:border-[#7c3aed] text-[#a78bfa] rounded-xl transition-colors"
            >
              Início rápido
            </a>
          </div>

          {/* Version badge */}
          <span className="text-xs font-mono text-[#4b5563] border border-[#1f1a35] rounded-full px-4 py-1.5">
            @kinetnode/versioner · sem dependências externas
          </span>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#4b5563]">
          <span className="text-xs font-mono">scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#4b5563] to-transparent" />
        </div>
      </section>

      {/* Antes / Depois */}
      <Section id="como-funciona">
        <SectionTitle tag="Como funciona">Antes e depois</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-mono text-[#ef4444] mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ef4444]" /> Antes
            </p>
            <CodeBlock>{`# edita package.json manualmente
# edita app.json manualmente
git add .
git commit -m "v1.4.273 - Corrige login"
git push`}</CodeBlock>
          </div>
          <div>
            <p className="text-sm font-mono text-[#10b981] mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" /> Depois
            </p>
            <CodeBlock>{`versioner build "Corrige login"`}</CodeBlock>
            <p className="mt-4 text-sm text-[#6b7280] leading-relaxed">
              Versiona todos os arquivos configurados, commita com o template definido e faz push — tudo de uma vez.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="mt-20 grid sm:grid-cols-3 gap-8">
          {STEPS.map(({ n, title, body }) => (
            <div key={n} className="relative p-6 rounded-2xl bg-[#1a1630] border border-[#2d2550] hover:border-[#7c3aed]/50 transition-colors">
              <span className="font-mono text-4xl font-bold text-[#2d2550]">{n}</span>
              <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-[#6b7280] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Modelo de versão */}
      <section className="px-6 py-24 bg-[#13101f] border-y border-[#2d2550]">
        <div className="max-w-5xl mx-auto">
          <SectionTitle tag="Versionamento">Modelo major.minor.build</SectionTitle>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { label: 'build', color: '#7c3aed', example: '1.4.272 → 1.4.273', desc: 'Incrementa em toda release. Nunca zera — representa o total de releases desde o início.' },
              { label: 'minor', color: '#a78bfa', example: '1.4.272 → 1.5.273', desc: 'Pequenas evoluções dentro da versão principal. Zera ao ocorrer um major.' },
              { label: 'major', color: '#c4b5fd', example: '1.4.272 → 2.0.273', desc: 'Grandes marcos: primeira versão pública, reescrita, nova arquitetura.' },
            ].map(({ label, color, example, desc }) => (
              <div key={label} className="p-6 rounded-2xl bg-[#1a1630] border border-[#2d2550]">
                <span className="font-mono text-sm font-semibold px-2 py-0.5 rounded" style={{ color, background: `${color}18` }}>
                  {label}
                </span>
                <p className="mt-4 font-mono text-sm text-[#c4b5fd]">{example}</p>
                <p className="mt-3 text-sm text-[#6b7280] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-[#4b5563]">
            O formato é compatível com <code className="text-[#7c3aed]">x.y.z</code> — o <code className="text-[#7c3aed]">package.json</code> permanece válido.
            Para comportamento SemVer padrão, ative <code className="text-[#7c3aed]">semver: true</code> na configuração.
          </p>
        </div>
      </section>

      {/* Comandos */}
      <Section id="comandos">
        <SectionTitle tag="Referência">Comandos</SectionTitle>
        <div className="overflow-x-auto rounded-2xl border border-[#2d2550]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1a1630] border-b border-[#2d2550]">
                <th className="text-left px-6 py-4 font-mono text-[#7c3aed] font-semibold">Comando</th>
                <th className="text-left px-6 py-4 font-mono text-[#6b7280] font-medium">O que faz</th>
              </tr>
            </thead>
            <tbody>
              {COMMANDS.map(({ cmd, desc, example }, i) => (
                <tr key={cmd} className={`border-b border-[#2d2550]/50 hover:bg-[#1a1630]/60 transition-colors ${i === COMMANDS.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="px-6 py-4 font-mono text-[#c4b5fd] whitespace-nowrap">
                    <Tooltip text={example}>{cmd}</Tooltip>
                  </td>
                  <td className="px-6 py-4 text-[#6b7280]">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-1 gap-y-2 text-sm text-[#4b5563] font-mono">
          <span>Aliases:</span>
          {ALIASES.map(({ alias, full, example }, i) => (
            <span key={alias} className="inline-flex items-center gap-1">
              <Tooltip text={example}>
                <span className="text-[#7c3aed] border-b border-dotted border-[#7c3aed]/40 hover:border-[#7c3aed]">
                  {alias}
                </span>
              </Tooltip>
              {i < ALIASES.length - 1 && <span className="text-[#2d2550]">·</span>}
            </span>
          ))}
        </div>

        {/* Flags */}
        <h3 className="mt-16 mb-6 text-xl font-semibold text-white">Flags de release</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {FLAGS.map(({ flag, desc, example }, i) => (
            <div key={flag} className={`flex items-start gap-4 p-4 rounded-xl bg-[#1a1630] border border-[#2d2550] hover:border-[#7c3aed]/40 transition-colors${i === FLAGS.length - 1 && FLAGS.length % 2 !== 0 ? ' sm:col-span-2' : ''}`}>
              <Tooltip text={example}>
                <code className="shrink-0 text-xs font-mono text-[#a78bfa] bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded-md px-2 py-1">
                  {flag}
                </code>
              </Tooltip>
              <span className="text-sm text-[#6b7280]">{desc}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Instalação / Quickstart */}
      <section id="instalacao" className="px-6 py-24 bg-[#13101f] border-y border-[#2d2550]">
        <div className="max-w-5xl mx-auto">
          <SectionTitle tag="Instalação">Início rápido</SectionTitle>
          <div className="flex flex-col gap-6 max-w-2xl">
            <div>
              <p className="mb-2 text-sm text-[#6b7280]">1. Instale globalmente</p>
              <CodeBlock copy="npm install -g @kinetnode/versioner">
                npm install -g @kinetnode/versioner
              </CodeBlock>
            </div>
            <div>
              <p className="mb-2 text-sm text-[#6b7280]">2. Inicialize no projeto</p>
              <CodeBlock copy="versioner init">
                versioner init
              </CodeBlock>
            </div>
            <div>
              <p className="mb-2 text-sm text-[#6b7280]">3. Primeira release</p>
              <CodeBlock copy='versioner build "primeira release"'>
                {`versioner build "primeira release"`}
              </CodeBlock>
            </div>
          </div>
          <p className="mt-8 text-sm text-[#4b5563]">
            Requer Node.js 18 ou superior. Sem dependências externas — só Node.js e Git.
          </p>
        </div>
      </section>

      {/* versioner-cli */}
      <Section id="cli">
        <SectionTitle tag="versioner-cli">Modo interativo</SectionTitle>
        <p className="text-[#6b7280] text-center max-w-xl mx-auto mb-12 -mt-4">
          Powered by <span className="text-[#a78bfa] font-mono">cliplay</span> — navegue pelos comandos com o teclado, sem precisar lembrar flags.
        </p>

        <div className="grid sm:grid-cols-2 gap-8 items-center">
          {/* TUI mockup */}
          <div className="rounded-xl bg-[#0d0d16] border border-[#2d2550] overflow-hidden font-mono text-sm">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#2d2550] bg-[#1a1630]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></span>
              <span className="text-xs text-[#4b5563] mx-auto">versioner-cli</span>
            </div>
            <div className="p-4">
              <div className="text-[#4b5563] text-xs mb-3">Selecione um comando  <span className="text-[#2d2550]">↑↓ navegar · enter selecionar · q sair</span></div>
              <div className="space-y-1">
                {[
                  { cmd: 'build',     desc: 'Incrementa build e publica', active: true },
                  { cmd: 'minor',     desc: 'Incrementa minor e build',   active: false },
                  { cmd: 'major',     desc: 'Incrementa major, zera minor', active: false },
                  { cmd: 'status',    desc: 'Mostra versão e estado git', active: false },
                  { cmd: 'log',       desc: 'Lista commits recentes',     active: false },
                  { cmd: 'changelog', desc: 'Gera CHANGELOG.md',          active: false },
                ].map(({ cmd, desc, active }) => (
                  <div key={cmd} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${active ? 'bg-[#7c3aed]/20 border border-[#7c3aed]/30' : 'border border-transparent'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active ? 'bg-[#a78bfa]' : 'bg-[#2d2550]'}`}></span>
                    <span className={`w-20 ${active ? 'text-[#c4b5fd]' : 'text-[#4b5563]'}`}>{cmd}</span>
                    <span className="text-[#374151] text-xs">{desc}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-[#1a1630] text-xs text-[#374151]">
                <span className="text-[#534AB7]">versioner-cli</span> · cliplay theme
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#a78bfa] text-sm font-bold">↑↓</span>
              </div>
              <div>
                <p className="text-white font-medium mb-1">Navegação por teclado</p>
                <p className="text-[#6b7280] text-sm">Setas para mover, enter para executar, q para sair. Sem precisar memorizar nenhum comando.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#a78bfa] text-sm">✦</span>
              </div>
              <div>
                <p className="text-white font-medium mb-1">Powered by cliplay</p>
                <p className="text-[#6b7280] text-sm">Interface temática construída com cliplay, o TUI acoplável da kinetnode.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#a78bfa] text-sm font-mono">=</span>
              </div>
              <div>
                <p className="text-white font-medium mb-1">Mesmos resultados</p>
                <p className="text-[#6b7280] text-sm">Todos os comandos do versioner disponíveis — só a forma de interagir muda.</p>
              </div>
            </div>
            <div className="pt-2">
              <CodeBlock copy="npm install -g @kinetnode/versioner-cli">
                npm install -g @kinetnode/versioner-cli
              </CodeBlock>
              <a
                href="https://www.npmjs.com/package/@kinetnode/versioner-cli"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-lg border border-[#2d2550] text-sm font-mono text-[#a78bfa] hover:border-[#7c3aed] hover:bg-[#7c3aed]/10 transition-colors"
              >
                npm ↗ @kinetnode/versioner-cli
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-[#2d2550]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Versioner" className="w-7 h-7 opacity-80" />
            <span className="font-mono text-sm text-[#4b5563]">@kinetnode/versioner</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://www.npmjs.com/package/@kinetnode/versioner" target="_blank" rel="noreferrer" className="text-sm text-[#4b5563] hover:text-[#a78bfa] transition-colors font-mono">npm</a>
            <a href="https://github.com/Carlos-iso/versioner" target="_blank" rel="noreferrer" className="text-sm text-[#4b5563] hover:text-[#a78bfa] transition-colors font-mono">github</a>
          </div>
          <span className="text-xs font-mono text-[#374151]">MIT License</span>
        </div>
      </footer>
    </div>
  )
}
