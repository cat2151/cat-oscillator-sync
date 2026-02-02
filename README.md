# cat-oscillator-sync

🎵 Mouse-controllable Oscillator Hard Sync Synthesizer

<p align="left">
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵-Japanese-red.svg" alt="Japanese"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸-English-blue.svg" alt="English"></a>
</p>

## 🌐 Try in Browser

**[→ Open Demo on GitHub Pages](https://cat2151.github.io/cat-oscillator-sync/)**

Try it instantly in your browser. No installation required!

---

## 📦 Implementation Status and Installation

This project implements the same oscillator sync algorithm in multiple languages.
Each implementation has a **Simple version** (stepped frequency change every 8ms) and a **Smooth version** (smooth frequency change per sample).

### 🐍 Python Version

**Status**: ✅ Fully functional

**One-liner Installation (Recommended)**:
```bash
pipx install git+https://github.com/cat2151/cat-oscillator-sync
```

**Execution**:
```bash
cat-oscillator-sync-simple  # Simple version
cat-oscillator-sync-smooth  # Smooth version
```

**Traditional Method**:
```bash
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync
pip install -r requirements.txt
python src/python/sync_simple.py
```

**Details**: [Enjoy Synthesizer Oscillator Sync Sound in 50 Lines of Python](https://zenn.dev/cat2151/scraps/bc9dca9b75a901)

---

### 🦀 Rust Version

**Status**: ✅ Fully functional

**One-liner Installation**:
```bash
cargo install --git https://github.com/cat2151/cat-oscillator-sync --root . cat-oscillator-sync
```

After installation, the binaries will be located in the `./bin/` directory.

**Execution**:
```bash
./bin/sync_simple  # Simple version
./bin/sync_smooth  # Smooth version
```

**Traditional Method**:
```bash
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync/src/rust
cargo build --release
cargo run --release --bin sync_simple
```

**Features**:
- ✅ Fast and memory-safe implementation
- ✅ Low latency (approx. 8ms)
- ✅ Installable with a one-liner

---

### 🐹 Go Version (Pure Go - Oto) ⭐ Recommended

**Status**: ✅ Fully functional - No C compiler required

**One-liner Installation**:
```bash
go install github.com/cat2151/cat-oscillator-sync/go/cmd/sync_simple_oto@latest
go install github.com/cat2151/cat-oscillator-sync/go/cmd/sync_smooth_oto@latest
```

**Execution**:
```bash
sync_simple_oto  # Simple version
sync_smooth_oto  # Smooth version
```

**Traditional Method**:
```bash
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync/src/go
go build -o bin/sync_simple_oto.exe ./cmd/sync_simple_oto
go build -o bin/sync_smooth_oto.exe ./cmd/sync_smooth_oto
./bin/sync_simple_oto.exe
```

**Features**:
- ✅ Pure Go implementation - No CGO, no C compiler required
- ✅ Easy build - Buildable with just `go build`
- ✅ Cross-compilation support

**Details**: [src/go/README.md](src/go/README.md)

---

### 🐹 Go Version (PortAudio + Zig cc)

**Status**: ✅ Fully functional - Requires Zig cc

**Installation**:

This version uses Zig cc, so one-liner installation is not recommended.
Environment setup is required; please follow these steps:

```bash
# 1. Install Zig (if not already installed)
scoop install zig  # Or download from the official website

# 2. Clone the repository
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync/src/go-portaudio

# 3. Download PortAudio DLL
python download_portaudio.py

# 4. Build
set CC=zig cc
set CXX=zig c++
set CGO_ENABLED=1
go build -o bin/sync_simple.exe ./cmd/sync_simple
go build -o bin/sync_smooth.exe ./cmd/sync_smooth
```

**Execution**:
```bash
cd bin
sync_simple.exe  # Simple version
sync_smooth.exe  # Smooth version
```

**Features**:
- ✅ Best latency and performance
- ❌ Requires Zig cc (uses CGO)
- ⚠️ Setup is somewhat complex

**For general users, the Pure Go version (Oto) is recommended.**

**Details**: [src/go-portaudio/README.md](src/go-portaudio/README.md)

---

### 🌐 TypeScript Version (Browser)

**Status**: ✅ Fully functional - Published on GitHub Pages

**How to Use**:

**Try Online (Easiest)**:
- Access the [GitHub Pages Demo](https://cat2151.github.io/cat-oscillator-sync/)
- No installation required!

**For Local Development**:
```bash
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync/src/typescript/browser
npm install
npm run dev  # Start development server
# Or
npm run build  # Production build
```

**Features**:
- ✅ Runs in browser without installation
- ✅ Low latency with Web Audio API (approx. 3ms)
- ✅ Both Simple and Smooth versions implemented
- ✅ Cross-platform compatibility

---

### 💻 TypeScript Version (CLI - Windows Only)

**Status**: ✅ Functional - Buffer latency (approx. 170ms)

**Installation**:

```bash
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync/src/typescript/cli
npm install
npm run build
```

**Execution**:
```bash
npm start              # Simple version
node dist/main.js smooth  # Smooth version
```

**Notes**:
- ⚠️ Windows only (depends on `robotjs`, `naudiodon` native modules)
- ⚠️ Buffer latency approx. 170ms (`naudiodon` limitation)
- ⚠️ Requires Visual Studio Build Tools

**Features**:
- ✅ Node.js-based CLI implementation
- ⚠️ Latency is higher than other implementations (approx. 170ms)

**If lower latency is required, the Browser, Python, Rust, or Go versions are recommended.**

**Details**: [src/typescript/cli/README.md](src/typescript/cli/README.md)

---

## 📊 Implementation Comparison

| Language | Status | Installation Difficulty | Latency | Recommendation |
|--------------------------|----------|-------------------------|-----------|----------------|
| TypeScript (Browser) | ✅ | ⭐⭐⭐⭐⭐ (No installation) | Approx. 3ms | ⭐⭐⭐⭐⭐ |
| Python | ✅ | ⭐⭐⭐⭐⭐ (pipx 1-liner) | Approx. 8ms | ⭐⭐⭐⭐⭐ |
| Go (Pure Go - Oto) | ✅ | ⭐⭐⭐⭐ (go install) | Approx. 16ms | ⭐⭐⭐⭐ |
| Rust | ✅ | ⭐⭐⭐ (cargo install) | Approx. 8ms | ⭐⭐⭐⭐ |
| Go (PortAudio) | ✅ | ⭐⭐ (Requires Zig cc) | Approx. 8ms | ⭐⭐⭐ |
| TypeScript (CLI) | ✅ | ⭐⭐ (Requires build tools) | Approx. 170ms | ⭐⭐ |

---

## 🎮 How to Use

Common operation method for all implementations:

1. Run the program to start the audio stream.
2. Move your mouse across the screen to control the sound.
   - **X-axis (horizontal)**: Master Frequency (40Hz - 600Hz)
   - **Y-axis (vertical)**: Slave Frequency (100Hz - 2000Hz)
3. Exit with `Ctrl + C`.

---

## 🔧 Batch Build & Run All Applications (Windows Only)

You can build all language versions at once and select one to run from a menu:

```bash
python build_and_run.py
```

This script sequentially executes the build scripts for each language and provides a menu for selection and execution.

---

## 📝 Technical Details

### What is Hard Sync (Oscillator Synchronization)?

Hard sync is an audio synthesis technique where one oscillator (the master) forcibly resets the phase of another oscillator (the slave).

- Generates rich, harmonic timbres.
- The timbre changes based on the ratio of the master and slave frequencies.
- A technique commonly used in classic analog synthesizers.

### Differences between Simple and Smooth Versions

#### Simple Version
- Mouse position changes are reflected in the sound every 8ms.
- Rapid mouse movement results in stepped frequency changes.
- Simple implementation, easy to understand the mechanism.

#### Smooth Version
- Achieves smooth frequency changes per sample through exponential smoothing.
- Smoothness can be adjusted with a time constant (default 16ms).
- More musical and practical operation.

---

## 📚 Project Goals

- [x] Python: Achieve a simple app that can be easily installed, launches in 1 second, and produces sound, generated by an LLM chatbot.
- [x] Rust: Verify if the Python implementation can be ported to Rust by an agent.
- [x] Go: Similarly, verify if it can be ported to Go by an agent.
- [x] TypeScript: Similarly, verify if it can be ported to TypeScript by an agent.

**Result**: Achieved in all languages!

---

## 🎯 Completed Implementations

- [x] Python implementation
- [x] Rust implementation
- [x] Go implementation (Pure Go - Oto)
- [x] Go implementation (PortAudio + Zig cc)
- [x] TypeScript implementation (Browser version)
- [x] TypeScript implementation (CLI version - Windows only)

---

## ⚖️ License

This project is released under the [MIT License](LICENSE).

---

## 🔗 Related Links

- [Main README](README.md)
- [Zenn scraps article (Python version explanation)](https://zenn.dev/cat2151/scraps/bc9dca9b75a901)
- [GitHub Pages Demo](https://cat2151.github.io/cat-oscillator-sync/)

---

※ This English README.md is automatically generated from README.ja.md by Gemini translation via GitHub Actions.