
{ pkgs ? import <nixpkgs> {} }:

let
  bun = pkgs.stdenvNoCC.mkDerivation {
    pname = "bun";
    version = "1.4.0";

    src = pkgs.fetchurl {
      url = "https://github.com/oven-sh/bun/releases/download/bun-v1.4.0/bun-linux-x64.zip";
      sha256 = "0lp45zljagwcv1l2jv7mi3a1j6hsrsr838m0mikvbj1sp1gzn0rd";
    };

    sourceRoot = "bun-linux-x64";
    nativeBuildInputs = with pkgs; [
      autoPatchelfHook
      unzip
    ];
    buildInputs = [ pkgs.openssl ];

    dontConfigure = true;
    dontBuild = true;

    installPhase = ''
      runHook preInstall
      install -Dm755 bun "$out/bin/bun"
      ln -s "$out/bin/bun" "$out/bin/bunx"
      runHook postInstall
    '';
  };
in
pkgs.mkShell {
  packages = [ bun ];

  shellHook = ''
    echo "sewadah frontend shell — $(bun --version)"
  '';
}
