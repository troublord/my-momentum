import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { authenticateWithGoogle } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";

const IntroPage: React.FC = () => {
  const { setAccessToken } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleCredential = async (credential?: string) => {
    if (!credential) {
      setError("未取得 Google 憑證");
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const { accessToken } = await authenticateWithGoogle(credential);
      setAccessToken(accessToken);
    } catch (e) {
      setError("登入失敗，請稍後再試");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary-600 text-white flex items-center justify-center font-bold">
              M
            </div>
            <span className="text-lg font-semibold tracking-tight">
              MyMomentum
            </span>
          </div>
          <div className="flex items-center">
            <GoogleLogin
              onSuccess={(credentialResponse) =>
                handleGoogleCredential(credentialResponse.credential)
              }
              onError={() => setError("Google 登入失敗，請重試")}
              theme="outline"
              size="medium"
              locale="zh-TW"
            />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-b from-primary-50 to-white"
            aria-hidden
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-primary-600 font-semibold">
                  MyMomentum 專案簡報 v1.0
                </p>
                <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                  通用的時間紀錄與習慣追蹤工具
                </h1>
                <p className="mt-4 text-gray-600 leading-7">
                  打造一款工具，幫助你看見日常中原本被遺忘的小努力，
                  建立積少成多的正向循環感。無論閱讀、伸展、冥想或運動，
                  都能被簡單地紀錄與統計。
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start gap-3">
                    <span
                      className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-600"
                      aria-hidden
                    />
                    <span className="text-gray-700">
                      看見日常中「原本被遺忘的小努力」
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span
                      className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-600"
                      aria-hidden
                    />
                    <span className="text-gray-700">
                      建立積少成多的「正向循環感」
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span
                      className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-600"
                      aria-hidden
                    />
                    <span className="text-gray-700">
                      🎯 關鍵特性：極簡介面、彈性紀錄、可視化成就感
                    </span>
                  </li>
                </ul>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <div className="inline-flex">
                    <GoogleLogin
                      onSuccess={(credentialResponse) =>
                        handleGoogleCredential(credentialResponse.credential)
                      }
                      onError={() => setError("Google 登入失敗，請重試")}
                      theme="filled_blue"
                      size="large"
                      text="continue_with"
                      locale="zh-TW"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: "smooth",
                      })
                    }
                    className="btn-secondary"
                    aria-label="了解更多"
                  >
                    了解更多
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-[4/3] w-full rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
                  <div className="grid grid-cols-3 gap-4 h-full">
                    <div className="card flex flex-col items-center justify-center text-center">
                      <span className="text-3xl">📚</span>
                      <p className="mt-2 text-sm text-gray-600">閱讀</p>
                    </div>
                    <div className="card flex flex-col items-center justify-center text-center">
                      <span className="text-3xl">🏃‍♂️</span>
                      <p className="mt-2 text-sm text-gray-600">運動</p>
                    </div>
                    <div className="card flex flex-col items-center justify-center text-center">
                      <span className="text-3xl">🧘‍♀️</span>
                      <p className="mt-2 text-sm text-gray-600">冥想</p>
                    </div>
                    <div className="card flex flex-col items-center justify-center text-center">
                      <span className="text-3xl">💻</span>
                      <p className="mt-2 text-sm text-gray-600">程式設計</p>
                    </div>
                    <div className="card flex flex-col items-center justify-center text-center">
                      <span className="text-3xl">✍️</span>
                      <p className="mt-2 text-sm text-gray-600">寫作</p>
                    </div>
                    <div className="card flex flex-col items-center justify-center text-center">
                      <span className="text-3xl">🗣️</span>
                      <p className="mt-2 text-sm text-gray-600">學習語言</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold tracking-tight">
              為什麼選擇 MyMomentum？
            </h2>
            <p className="mt-4 text-gray-600 leading-7">
              我們重視極簡與彈性，讓你能用最順手的方式記錄，
              並透過視覺化的數據，持續累積成就感。
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between text-sm text-gray-500">
          <span>© {new Date().getFullYear()} MyMomentum</span>
          <a
            href="/terms"
            className="hover:text-gray-700"
            aria-label="閱讀條款與隱私權政策"
          >
            條款與隱私
          </a>
        </div>
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 text-sm text-red-600">
            {error}
          </div>
        )}
      </footer>
    </div>
  );
};

export default IntroPage;
