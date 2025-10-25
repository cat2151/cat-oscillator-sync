# GitHub Copilot Instructions for cat-oscillator-sync

## Code Formatting and Quality

**IMPORTANT: Before committing any code changes, you MUST run the following commands:**

```bash
# Format the code with ruff
ruff format src/ tests/

# Check for linting issues
ruff check src/ tests/

# Fix auto-fixable linting issues
ruff check --fix src/ tests/
```

**Why this is critical:**
- GitHub Actions workflows for automated ruff formatting have been removed for security reasons (PWN Request vulnerability)
- All code must be properly formatted before creating a PR
- Linting issues must be fixed before committing

## Project Structure

This is a multi-language project implementing a mouse-controlled hard-sync oscillator synthesizer:

- `src/python/` - Python source code (2 implementations: simple and smooth)
- `src/rust/` - Rust source code (2 implementations: simple and smooth)
- `src/go/` - Go source code (requires CGO and C compiler)
- `src/typescript/` - TypeScript source code
  - `browser/` - Web-based implementation using Web Audio API
  - `cli/` - Node.js CLI implementation (Windows only)
- `tests/` - Test files (currently no test suite exists)
- Configuration files for development tools (ruff, pytest, VSCode)

### Language-Specific Build Commands

**Python:**
```bash
# No build required, run directly
python src/python/sync_simple.py
python src/python/sync_smooth.py
```

**Rust:**
```bash
cd src/rust
cargo build --release
cargo run --release --bin sync_simple
cargo run --release --bin sync_smooth
```

**Go:**
```bash
cd src/go
set CGO_ENABLED=1  # Windows
export CGO_ENABLED=1  # Linux/Mac
go build -o bin/sync_simple.exe ./cmd/sync_simple
go build -o bin/sync_smooth.exe ./cmd/sync_smooth
```

**TypeScript (Browser):**
```bash
cd src/typescript/browser
npm install
npm run dev  # Development server
npm run build  # Production build
```

**TypeScript (CLI - Windows only):**
```bash
cd src/typescript/cli
npm install
npm run build
npm start  # Run the CLI application
```

**All languages at once (Windows):**
```bash
python build_and_run.py
```

## Development Standards

### Code Style
- Maximum line length: 120 characters
- Use double quotes for strings (Python)
- Use spaces for indentation (4 spaces for Python)
- Follow PEP 8 guidelines for Python (enforced by ruff)
- Organize imports with isort (integrated in ruff)
- For Rust: Follow `rustfmt` and `clippy` guidelines
- For Go: Follow `gofmt` and `golint` guidelines
- For TypeScript: Follow existing ESLint/Prettier configuration

### Testing
- **Python**: Use pytest for Python tests
  - Place tests in the `tests/` directory
  - Name test files as `test_*.py`
  - Run tests: `pytest`
  - **Note**: Currently no test suite exists for this project
- **Rust**: Use built-in test framework
  - Run tests: `cargo test`
- **Go**: Use built-in test framework
  - Run tests: `go test ./...`
- **TypeScript**: Use Vitest or Jest
  - Run tests: `npm test`

### VSCode Extensions
If working in VSCode, install these recommended extensions:
1. Python (ms-python.python)
2. Pylance (ms-python.vscode-pylance)
3. Ruff (charliermarsh.ruff)
4. EditorConfig for VS Code (editorconfig.editorconfig)

## Best Practices

1. **Always format and lint before committing:**
   ```bash
   ruff format . && ruff check --fix .
   ```

2. **Run tests to ensure nothing breaks:**
   ```bash
   pytest
   ```

3. **Keep commits focused and atomic**
   - One logical change per commit
   - Write clear, descriptive commit messages

4. **Follow the existing code patterns**
   - Match the style of surrounding code
   - Maintain consistency across the codebase

## Security Considerations

- Never commit sensitive data (API keys, passwords, tokens)
- Never commit secrets into source code
- Use environment variables for configuration
- Follow the principle of least privilege
- GitHub Actions workflows for automated checks were removed due to PWN Request vulnerability

## Troubleshooting

### Python Issues
- **PyAudio installation fails**: May need system audio libraries (PortAudio)
- **No audio output**: Check default audio device in system settings

### Rust Issues
- **Build fails**: Update Rust with `rustup update`
- **Missing Visual Studio Build Tools**: Install "C++ Desktop Development" from Visual Studio
- **Audio device errors**: Verify default output device in system settings

### Go Issues
- **"build constraints exclude all Go files"**: CGO is disabled or C compiler not found
  - Enable CGO: `set CGO_ENABLED=1` (Windows) or `export CGO_ENABLED=1` (Linux/Mac)
  - Install C compiler: TDM-GCC or MinGW-w64 on Windows
- **PortAudio DLL missing**: Run `python download_portaudio.py` in `src/go/`
- **Runtime errors**: Ensure DLL is in same directory as executable

### TypeScript Issues
- **Browser version build fails**: Run `npm install` in `src/typescript/browser/`
- **CLI version fails on non-Windows**: CLI version is Windows-only
- **Native module build fails**: Install Visual Studio Build Tools with "Desktop development with C++"
- **Audio stuttering**: Try adjusting buffer size in code

### General
- **Mouse not responding**: May need administrator privileges or security software might be blocking

## Common Commands

```bash
# Install development dependencies
pip install ruff pytest

# Format all Python files
ruff format .

# Check for linting issues
ruff check .

# Auto-fix linting issues
ruff check --fix .

# Run tests
pytest

# Run tests with verbose output
pytest -v

# Run specific test file
pytest tests/test_example.py
```

## Workflow

1. Make code changes
2. Format code: `ruff format .`
3. Check and fix linting: `ruff check --fix .`
4. Run tests: `pytest`
5. Commit changes with descriptive message
6. Create PR when ready

## Project-Specific Notes

### Important Constraints
- **NO automated GitHub Actions for ruff check** - manual checking is required before creating PRs
- **No test suite exists** - This is an experimental project focused on demonstrating multi-language implementation
- **Go requires CGO** - Needs C compiler (MinGW/TDM-GCC on Windows) for PortAudio bindings
- **TypeScript CLI is Windows-only** - Uses native modules that require Windows-specific dependencies

### Configuration Files
- `.vscode/settings.json` - Auto-format on save configured for VSCode
- `.editorconfig` - Consistent formatting across different editors
- `ruff.toml` - Project-specific linting and formatting rules for Python
- `pytest.ini` - Pytest configuration (though no tests currently exist)
- `Cargo.toml` - Rust project configuration in `src/rust/`
- `go.mod` - Go module configuration in `src/go/`
- `package.json` - TypeScript configurations in `src/typescript/browser/` and `src/typescript/cli/`

### Project Goals
This project demonstrates:
1. ✅ Implementing the same audio synthesis algorithm in multiple languages
2. ✅ Using LLM chatbots to generate and port code across languages
3. ✅ Quick startup time (< 1 second) for audio applications
4. ✅ Comparing implementation approaches and performance across languages

### Out of Scope
- MIDI control
- Audio effects/processing
- Plugin/VST format
- Mobile platforms

## userによる指示
- Windows専用とします。ハルシネーション予防のためです。
  - LinuxやMac向けの実装やそれに関するドキュメントは積極的に削除してください。
- mingwは使わないものとします。ハルシネーション予防のためです。
  - mingwを使う実装やそれに関するドキュメントは積極的に削除してください。
