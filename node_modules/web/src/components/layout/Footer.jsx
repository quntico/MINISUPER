
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>© 2026 MINISUPER. Sistema de punto de venta.</span>
          <div className="flex items-center gap-4">
            <span>Versión 1.0.0</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Sistema activo
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
