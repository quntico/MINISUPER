
import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const validations = {
    length: formData.new.length >= 8,
    uppercase: /[A-Z]/.test(formData.new),
    number: /[0-9]/.test(formData.new),
    match: formData.new === formData.confirm && formData.new !== ''
  };

  const isFormValid = Object.values(validations).every(Boolean) && formData.current !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      toast.success('Contraseña actualizada exitosamente');
      setFormData({ current: '', new: '', confirm: '' });
      onClose();
    }
  };

  const ValidationItem = ({ isValid, text }) => (
    <div className={`flex items-center gap-2 text-sm ${isValid ? 'text-emerald-500' : 'text-muted-foreground'}`}>
      {isValid ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
      <span>{text}</span>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Lock className="w-5 h-5 text-primary" />
            Cambiar Contraseña
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="current">Contraseña Actual</Label>
            <Input 
              id="current" 
              type="password" 
              value={formData.current}
              onChange={(e) => setFormData({ ...formData, current: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new">Nueva Contraseña</Label>
            <div className="relative">
              <Input 
                id="new" 
                type={showPassword ? "text" : "password"} 
                value={formData.new}
                onChange={(e) => setFormData({ ...formData, new: e.target.value })}
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirmar Nueva Contraseña</Label>
            <Input 
              id="confirm" 
              type={showPassword ? "text" : "password"} 
              value={formData.confirm}
              onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <div className="bg-muted/50 p-4 rounded-xl space-y-2 mt-4 border border-border">
            <p className="text-sm font-medium mb-2">Requisitos de la contraseña:</p>
            <ValidationItem isValid={validations.length} text="Mínimo 8 caracteres" />
            <ValidationItem isValid={validations.uppercase} text="Al menos una letra mayúscula" />
            <ValidationItem isValid={validations.number} text="Al menos un número" />
            <ValidationItem isValid={validations.match} text="Las contraseñas coinciden" />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormValid}
              className="bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              Cambiar Contraseña
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
