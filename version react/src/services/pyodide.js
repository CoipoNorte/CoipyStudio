export async function initPyodide(onStdout, onStderr) {
  const pyodide = await window.loadPyodide({
    stdout: onStdout,
    stderr: onStderr
  })
  await pyodide.loadPackage('micropip')
  return pyodide
}

export async function runCode(pyodide, code, addLine, cfg) {
  // Setup stdout/stderr capture
  pyodide.runPython(`
import sys, io
class OC:
    def __init__(s, cb): s._cb = cb
    def write(s, t):
        if t and t.strip():
            from js import _ao
            _ao(t, s._cb)
    def flush(s): pass
sys.stdout = OC('o')
sys.stderr = OC('e')
`)
  window._ao = (t, tp) => addLine(t, tp)

  // Lint
  if (cfg.lint) {
    try {
      await pyodide.runPythonAsync('import pyflakes')
    } catch {
      addLine('Installing pyflakes...', 's')
      await pyodide.runPythonAsync('import micropip\nawait micropip.install("pyflakes")')
    }
    try {
      pyodide.globals.set('_lc', code)
      const lr = await pyodide.runPythonAsync(
        "import io\nfrom pyflakes.api import check\n_b=io.StringIO()\ncheck(_lc,'<editor>',_b)\n_b.getvalue()"
      )
      if (lr && lr.trim()) {
        addLine('Lint:', 's')
        lr.trim().split('\n').forEach(l => addLine('  ' + l, 'e'))
        addLine('\u2500'.repeat(36), 'i')
      }
    } catch {}
  }

  // Matplotlib hook
  if (code.includes('matplotlib') || code.includes('plt.')) {
    const bg = getComputedStyle(document.body).getPropertyValue('--b0').trim()
    window._si = null // will be set by caller
    try {
      await pyodide.loadPackage(['matplotlib', 'numpy'])
      await pyodide.runPythonAsync(`
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt
import io, base64
def _cs(*a, **k):
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=120, bbox_inches='tight', facecolor='${bg}', edgecolor='none')
    buf.seek(0)
    s = 'data:image/png;base64,' + base64.b64encode(buf.read()).decode('UTF-8')
    buf.close()
    from js import _si
    _si(s)
    plt.clf()
plt.show = _cs
`)
    } catch {}
  }

  await pyodide.runPythonAsync(code)
}

export async function pipInstall(pyodide, pkg) {
  await pyodide.runPythonAsync(`import micropip\nawait micropip.install("${pkg}")`)
}
