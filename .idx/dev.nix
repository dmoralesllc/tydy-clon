# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
  ];
  # Sets environment variables in the workspace
  env = {
    # IMPORTANT: Replace these with your actual Supabase credentials
    NEXT_PUBLIC_SUPABASE_URL = "https://bwikuaplwelthiclkokx.supabase.co";
    NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3aWt1YXBsd2VsdGhpY2xrb2t4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1MTUzMTUsImV4cCI6MjA3MjA5MTMxNX0.s6z_u1X1-X0EXctWTFCbHaBcnSKKpet52teQYkudFb4";
  };
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "dbaeumer.vscode-eslint"
    ];
    # Enable previews
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT"];
          manager = "web";
          cwd = "tydy-clon";
        };
      };
    };
    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        npm-install = "npm install --prefix tydy-clon";
      };
      # Runs when the workspace is (re)started
      onStart = {
        dev-server = "npm run dev --prefix tydy-clon";
      };
    };
  };
}
