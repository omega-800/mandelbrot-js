{
  description = "A nix-shell dev-environment flake";

  inputs.nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

  outputs =
    {
      self,
      nixpkgs,
    }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      eachSystem = f: nixpkgs.lib.genAttrs systems f;
    in
    {
      devShells = eachSystem (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        rec {
          mandelbroetli-js = pkgs.mkShellNoCC {
            packages = with pkgs; [
              nodejs_22
              typescript
            ];
          };
          default = mandelbroetli-js;
        }
      );
    };
}
