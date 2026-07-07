import React, { useState } from "react";
import { ChevronDown, LogOut, User, Lock, X, Eye, EyeOff } from "lucide-react";
import Perfil from "../pages/Perfil";
import api from "../api/axiosConfig";
import Button from "./ui/Button";
import Card from "./ui/Card";

export default function UserMiniProfile({ membro }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [viewMode, setViewMode] = useState("perfil");
  const [passwords, setPasswords] = useState({
    senhaAtual: "",
    novaSenha: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!membro) return null;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleUpdatePassword = async () => {
    try {
      await api.put("/meu-perfil", passwords);
      setFeedback({
        type: "success",
        text: "Credenciais atualizadas com sucesso!",
      });
      setPasswords({ senhaAtual: "", novaSenha: "" });
    } catch {
      setFeedback({
        type: "error",
        text: "Não foi possível atualizar a senha.",
      });
    }
  };

  const inputClass =
    "w-full rounded-sm border border-border px-4 py-2.5 text-body text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

  return (
    <>
      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        className="flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-surface px-1.5 py-1 shadow-sm transition-all hover:bg-bgSection"
      >
        <div className="relative">
          <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-success" />
          <img
            src={membro.foto || ""}
            alt={membro.nome}
            className="h-[40px] w-[40px] rounded-md border-2 border-white object-cover shadow-sm"
          />
        </div>

        <div className="hidden sm:block text-left">
          <p className="text-xs font-semibold text-text">{membro.nome}</p>
          <p className="mt-0.5 text-[10px] font-medium text-success">● Online</p>
        </div>

        <ChevronDown className="h-4 w-4 text-textMuted" />
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1.5 w-[200px] overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
            <div className="py-2 text-center">
              <img
                src={membro.foto || ""}
                alt={membro.nome}
                className="mx-auto mb-1 h-[50px] w-[50px] rounded-full border-2 border-white object-cover shadow-sm"
              />
              <p className="text-sm font-semibold text-text">{membro.nome}</p>
              <p className="text-[10px] text-textMuted">Conta Premium</p>
            </div>

            <div className="my-0 border-b border-border" />

            <button
              onClick={() => {
                setProfileOpen(true);
                setViewMode("perfil");
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-sm px-3 py-1.5 text-left text-xs font-semibold text-text transition hover:bg-bgSection"
            >
              <User size={14} />
              Meu Perfil
            </button>
            
            <div className="my-0 border-b border-border" />

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-sm px-3 py-1.5 text-left text-xs font-semibold text-danger transition hover:bg-dangerSoft"
            >
              <LogOut size={14} />
              Terminar Sessão
            </button>
          </div>
        </>
      )}

      {profileOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setProfileOpen(false)}
          />
          <div className="fixed right-4 top-4 z-[60] w-[95vw] max-w-[430px] overflow-hidden rounded-lg border border-border bg-surface shadow-lg sm:right-auto sm:left-1/2 sm:-translate-x-1/2">
            <div className="relative bg-primary px-4 py-4 text-center text-white">
              <button
                onClick={() => setProfileOpen(false)}
                className="absolute right-3 top-3 rounded-sm bg-white/15 p-2 text-white transition hover:bg-white/25"
              >
                <X size={20} />
              </button>
              <img
                src={membro.foto || ""}
                alt={membro.nome}
                className="mx-auto mb-1 h-[90px] w-[90px] rounded-full border-4 border-white object-cover shadow-sm"
              />
              <p className="text-xl font-bold">{membro.nome}</p>
              <p className="text-sm opacity-85">Área pessoal segura</p>
            </div>

            <div className="p-4">
              {feedback && (
                <div
                  className={`mb-3 rounded-sm px-4 py-3 text-body font-semibold ${
                    feedback.type === "success"
                      ? "bg-successSoft text-success"
                      : "bg-dangerSoft text-danger"
                  }`}
                >
                  {feedback.text}
                </div>
              )}

              {viewMode === "perfil" ? (
                <Perfil membro={membro} />
              ) : (
                <div className="space-y-3">
                  <p className="text-lg font-semibold text-text">
                    Alterar Credenciais
                  </p>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-textSecondary">
                      Senha Atual
                    </label>
                    <input
                      type="password"
                      value={passwords.senhaAtual}
                      onChange={(e) =>
                        setPasswords({ ...passwords, senhaAtual: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-textSecondary">
                      Nova Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwords.novaSenha}
                        onChange={(e) =>
                          setPasswords({ ...passwords, novaSenha: e.target.value })
                        }
                        className={`${inputClass} pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-text"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <Button onClick={handleUpdatePassword} className="w-full">
                    Atualizar Credenciais
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
