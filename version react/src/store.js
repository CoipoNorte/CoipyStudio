import { create } from 'zustand'

const defaultFS = {
  '/home': {
    type: 'd', children: {
      'main.py': { type: 'f', c: "# CoipyStudio\n# Ctrl+Enter to run\n\ndef fib(n):\n    a, b = 0, 1\n    r = []\n    for _ in range(n):\n        r.append(a)\n        a, b = b, a + b\n    return r\n\nfor i, v in enumerate(fib(12)):\n    print(f'F({i}) = {v}')\n\nprint('\\nDone!')\n" },
      'classes.py': { type: 'f', c: "class Animal:\n    def __init__(self, name, sound):\n        self.name = name\n        self.sound = sound\n    def speak(self):\n        return f'{self.name}: {self.sound}!'\n\nclass Dog(Animal):\n    def __init__(self, n, b):\n        super().__init__(n, 'Woof')\n        self.breed = b\n\nfor p in [Dog('Rex','Shepherd'), Dog('Max','Lab')]:\n    print(p.speak())\n" },
      'data': { type: 'd', children: {
        'sample.csv': { type: 'f', c: 'name,age,city\nAna,28,Madrid\nCarlos,35,Barcelona\nMaria,22,Valencia' },
        'config.json': { type: 'f', c: '{"app":"CoipyStudio","v":"1.0"}' }
      }},
      'scripts': { type: 'd', children: {
        'analysis.py': { type: 'f', c: "import csv\nwith open('/home/data/sample.csv') as f:\n    for r in csv.DictReader(f):\n        print(f\"{r['name']:10} age {r['age']}  {r['city']}\")\n" }
      }}
    }
  }
}

const useStore = create((set, get) => ({
  // Pyodide
  pyodide: null,
  pyReady: false,
  running: false,
  setPyodide: (p) => set({ pyodide: p, pyReady: true }),
  setRunning: (v) => set({ running: v }),

  // Settings
  cfg: { theme: 'default', lang: 'en', fs: '13.5', tab: '4', wrap: false, lnum: true, lint: false },
  setCfg: (patch) => set(s => ({ cfg: { ...s.cfg, ...patch } })),

  // Layout
  layout: 'right',
  setLayout: (v) => set({ layout: v }),
  toggleLayout: () => set(s => ({ layout: s.layout === 'right' ? 'bottom' : 'right' })),

  // Sidebar
  activePanel: 'files',
  sideOpen: true,
  toggleSide: (panel) => set(s => {
    if (s.activePanel === panel && s.sideOpen) return { sideOpen: false, activePanel: panel }
    return { sideOpen: true, activePanel: panel }
  }),

  // Filesystem
  fs: JSON.parse(JSON.stringify(defaultFS)),
  setFs: (fn) => set(s => ({ fs: fn(s.fs) })),

  // Current file & tabs
  curFile: null,
  tabs: [],
  openFile: (path) => set(s => {
    const newTabs = s.tabs.includes(path) ? s.tabs : [...s.tabs, path]
    return { curFile: path, tabs: newTabs }
  }),
  closeTab: (path) => set(s => {
    const newTabs = s.tabs.filter(t => t !== path)
    const newCur = s.curFile === path ? (newTabs.length ? newTabs[newTabs.length - 1] : null) : s.curFile
    return { tabs: newTabs, curFile: newCur }
  }),

  // Console
  consoleLines: [],
  addLine: (text, type) => set(s => ({ consoleLines: [...s.consoleLines, { text, type, id: Date.now() + Math.random() }] })),
  clearConsole: () => set({ consoleLines: [] }),

  // Packages
  packages: [],
  addPackage: (p) => set(s => ({ packages: s.packages.includes(p) ? s.packages : [...s.packages, p] })),
  removePackage: (p) => set(s => ({ packages: s.packages.filter(x => x !== p) })),

  // Plots
  plots: [],
  addPlot: (src) => set(s => ({ plots: [src, ...s.plots] })),

  // Context menu
  ctxMenu: null,
  showCtx: (x, y, path, item) => set({ ctxMenu: { x, y, path, item } }),
  hideCtx: () => set({ ctxMenu: null }),

  // Toast
  toast: null,
  showToast: (msg) => {
    set({ toast: msg })
    setTimeout(() => set({ toast: null }), 2000)
  },

  // Modals
  modal: null,
  openModal: (name, data) => set({ modal: { name, data } }),
  closeModal: () => set({ modal: null }),
}))

export default useStore
