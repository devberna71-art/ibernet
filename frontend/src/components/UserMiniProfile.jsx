import React, { useState } from "react";
import { ChevronDown, LogOut, User, Lock, X, Eye, EyeOff } from "lucide-react";

import Perfil from "../pages/Perfil";
import api from "../api/axiosConfig";

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
    window.location.href = "/login";
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

  return (
    <>
      {/* Profile Button */}
      <div
        onClick={() => setMenuOpen(true)}
        className="flex cursor-pointer items-center gap-1.5 rounded-[10px] border border-[#ECE5D8] bg-white px-1.5 py-1 shadow-sm transition-all hover:bg-[#FBE3CF]"
      >
        {/* Avatar with online indicator */}
        <div className="relative">
          <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#5C8A5C]" />
          <img
            src={membro.foto || ""}
            alt={membro.nome}
            className="h-[55px] w-[55px] rounded-[18px] border-3 border-white object-cover shadow-lg"
          />
        </div>

        {/* User info */}
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-[#211D19]">{membro.nome}</p>
          <p className="mt-0.5 text-xs font-medium text-[#5C8A5C]">● Online agora</p>
        </div>

        <ChevronDown className="h-6 w-6 text-[#8B8378] transition-transform group-hover:rotate-180" />
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-1.5 w-[260px] overflow-hidden rounded-[24px] border border-[#ECE5D8] bg-white shadow-lg">
            {/* Header */}
            <div className="py-2 text-center">
              <img
                src={membro.foto || ""}
                alt={membro.nome}
                className="mx-auto mb-1 h-[75px] w-[75px] rounded-full border-4 border-white object-cover shadow-lg"
              />
              <p className="font-extrabold text-[#0f172a]">{membro.nome}</p>
              <p className="text-xs text-[#64748b]">Conta Premium</p>
            </div>

            <div className="my-1 border-b border-gray-200" />

            {/* Menu Items */}
            <button
              onClick={() => {
                setProfileOpen(true);
                setViewMode("perfil");
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-[15px] px-4 py-1.5 text-left font-bold text-[#211D19] transition hover:bg-[#FBE3CF] hover:translate-x-1"
            >
              <User size={18} />
              Meu Perfil
            </button>

            <button
              onClick={() => {
                setProfileOpen(true);
                setViewMode("senha");
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-[15px] px-4 py-1.5 text-left font-bold text-[#211D19] transition hover:bg-[#FBE3CF] hover:translate-x-1"
            >
              <Lock size={18} />
              Alterar password
            </button>

            <div className="my-1 border-b border-gray-200" />

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-[15px] px-4 py-1.5 text-left font-extrabold text-[#B5332C] transition hover:bg-red-50 hover:translate-x-1"
            >
              <LogOut size={18} />
              Terminar Sessão
            </button>
          </div>
        </>
      )}

      {/* Profile Modal */}
      {profileOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setProfileOpen(false)}
          />
          <div className="fixed right-4 top-4 z-[60] w-[95vw] max-w-[430px] overflow-hidden rounded-[30px] border border-white/70 bg-white/92 shadow-2xl backdrop-blur-xl sm:right-auto sm:left-1/2 sm:-translate-x-1/2">
            {/* Header */}
            <div className="relative bg-[#D97A4D] px-4 py-3 text-center text-white">
              <button
                onClick={() => setProfileOpen(false)}
                className="absolute right-3 top-3 rounded-md bg-white/15 p-2 text-white transition hover:bg-white/25"
              >
                <X size={20} />
              </button>
              <img
                src={membro.foto || ""}
                alt={membro.nome}
                className="mx-auto mb-1 h-[90px] w-[90px] rounded-full border-4 border-white object-cover shadow-xl"
              />
              <p className="text-xl font-black">{membro.nome}</p>
              <p className="text-sm opacity-85">Área pessoal segura</p>
            </div>

            {/* Content */}
            <div className="p-3">
              {feedback && (
                <div
                  className={`mb-2 rounded-[15px] px-4 py-3 font-bold ${
                    feedback.type === "success"
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  {feedback.text}
                </div>
              )}

              {viewMode === "perfil" ? (
                <Perfil membro={membro} />
              ) : (
                <div className="space-y-2.5">
                  <p className="text-lg font-extrabold text-[#0f172a]">
                    Alterar Credenciais
                  </p>

                  {/* Current Password */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Senha Atual
                    </label>
                    <input
                      type="password"
                      value={passwords.senhaAtual}
                      onChange={(e) =>
                        setPasswords({ ...passwords, senhaAtual: e.target.value })
                      }
                      className="w-full rounded-[16px] border border-gray-300 px-4 py-2.5 focus:border-[#D97A4D] focus:outline-none focus:ring-2 focus:ring-[#D97A4D]/20"
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Nova Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwords.novaSenha}
                        onChange={(e) =>
                          setPasswords({ ...passwords, novaSenha: e.target.value })
                        }
                        className="w-full rounded-[16px] border border-gray-300 px-4 py-2.5 pr-12 focus:border-[#D97A4D] focus:outline-none focus:ring-2 focus:ring-[#D97A4D]/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleUpdatePassword}
                    className="mt-1 w-full rounded-[18px] bg-[#D97A4D] py-1.6 font-extrabold text-white transition hover:bg-[#C56A3F]"
                  >
                    Atualizar Credenciais
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
