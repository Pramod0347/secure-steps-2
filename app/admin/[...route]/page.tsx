"use client";
import PrivacyPolicy from "@/app/Privacy/page";
import { UniversityManagement } from "@/app/components/Select/ManageUniversities/UniversityManagement";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type AdminUser = {
  id: string;
  name: string | null;
  username: string | null;
  email: string;
  role: string;
  isVerified: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  userProfile: {
    id: string;
    completionPercentage: number;
    profileStatus: string;
    selectedPackage: string | null;
    selectedCountry: string | null;
    onboardingInfo: {
      educationLevel: string | null;
      targetIntake: string | null;
    } | null;
  } | null;
};

type EducationLevelValue = "" | "BACHELOR" | "MASTER" | "PHD";
type SupportedEducationLevel = "BACHELOR" | "MASTER" | "PHD";

type OnboardingQuestion = {
  key: string;
  label: string;
  answerType: "TEXT" | "SINGLE_SELECT" | "MULTI_SELECT" | "NUMBER" | "BOOLEAN" | "JSON";
  options?: string[];
  required?: boolean;
};

type OnboardingAnswer = {
  questionKey: string;
  answerType: OnboardingQuestion["answerType"];
  answerText: string | null;
  answerNumber: number | null;
  answerBoolean: boolean | null;
  answerJson: unknown | null;
};

const educationOptions: Array<{
  value: EducationLevelValue;
  label: string;
}> = [
  { value: "", label: "Select" },
  { value: "BACHELOR", label: "Bachelors" },
  { value: "MASTER", label: "Masters" },
  { value: "PHD", label: "Doctoral" },
];

const NotIntegrated = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      Not Integrated Yet.......
    </div>
  );
};

const UsersTable = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [educationDraft, setEducationDraft] = useState<Record<string, EducationLevelValue>>({});
  const [savingByUser, setSavingByUser] = useState<Record<string, boolean>>({});
  const [modalUser, setModalUser] = useState<AdminUser | null>(null);
  const [modalLevel, setModalLevel] = useState<SupportedEducationLevel | null>(null);
  const [modalQuestions, setModalQuestions] = useState<OnboardingQuestion[]>([]);
  const [modalAnswers, setModalAnswers] = useState<Record<string, string | string[]>>({});
  const [modalLoading, setModalLoading] = useState(false);
  const [modalSaving, setModalSaving] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/admin/users", { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to fetch users");
        }

        const fetchedUsers: AdminUser[] = data.users || [];
        setUsers(fetchedUsers);
        const draft: Record<string, EducationLevelValue> = {};
        fetchedUsers.forEach((user) => {
          const raw = user.userProfile?.onboardingInfo?.educationLevel;
          if (raw === "BACHELOR" || raw === "MASTER" || raw === "PHD") {
            draft[user.id] = raw;
          } else {
            draft[user.id] = "";
          }
        });
        setEducationDraft(draft);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch users";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-600">Loading users...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  const saveEducationLevel = async (userId: string) => {
    const level = educationDraft[userId];
    if (!level) {
      toast.error("Please select Bachelors, Masters, or Doctoral");
      return;
    }

    try {
      setSavingByUser((prev) => ({ ...prev, [userId]: true }));
      const res = await fetch(`/api/admin/users/${userId}/onboarding`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ educationLevel: level }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to save");
      }

      setUsers((prev) =>
        prev.map((user) => {
          if (user.id !== userId) return user;
          const nextProfile = user.userProfile
            ? user.userProfile
            : {
                id: data?.onboardingInfo?.userProfileId || "",
                completionPercentage: 0,
                profileStatus: "IN_PROGRESS",
                selectedPackage: null,
                selectedCountry: null,
                onboardingInfo: null,
              };

          return {
            ...user,
            userProfile: {
              ...nextProfile,
              onboardingInfo: {
                ...(nextProfile.onboardingInfo || {}),
                educationLevel: data?.onboardingInfo?.educationLevel || level,
                targetIntake: nextProfile.onboardingInfo?.targetIntake || null,
              },
            },
          };
        })
      );
      toast.success("Study level saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSavingByUser((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const openQuestionModal = async (user: AdminUser) => {
    const selectedLevel = educationDraft[user.id] as SupportedEducationLevel | "";
    if (!selectedLevel) {
      toast.error("Select study level first");
      return;
    }

    setModalUser(user);
    setModalLevel(selectedLevel);
    setModalQuestions([]);
    setModalAnswers({});
    setModalLoading(true);

    try {
      const res = await fetch(
        `/api/admin/users/${user.id}/onboarding/answers?educationLevel=${selectedLevel}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to load onboarding questions");
      }

      const questions: OnboardingQuestion[] = data.questions || [];
      const answers: OnboardingAnswer[] = data.answers || [];
      const answerMap: Record<string, string | string[]> = {};

      questions.forEach((q) => {
        const existing = answers.find((a) => a.questionKey === q.key);
        if (!existing) {
          answerMap[q.key] = "";
          return;
        }
        if (q.answerType === "NUMBER") {
          answerMap[q.key] = existing.answerNumber != null ? String(existing.answerNumber) : "";
          return;
        }
        if (q.answerType === "BOOLEAN") {
          answerMap[q.key] =
            existing.answerBoolean == null ? "" : existing.answerBoolean ? "true" : "false";
          return;
        }
        if (q.answerType === "MULTI_SELECT") {
          answerMap[q.key] = Array.isArray(existing.answerJson)
            ? (existing.answerJson as string[])
            : [];
          return;
        }
        answerMap[q.key] = existing.answerText || "";
      });

      setModalQuestions(questions);
      setModalAnswers(answerMap);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load questions");
    } finally {
      setModalLoading(false);
    }
  };

  const closeQuestionModal = () => {
    setModalUser(null);
    setModalLevel(null);
    setModalQuestions([]);
    setModalAnswers({});
    setModalLoading(false);
    setModalSaving(false);
  };

  const uploadModalAnswers = async () => {
    if (!modalUser || !modalLevel) return;
    try {
      setModalSaving(true);
      const payloadAnswers = modalQuestions.map((q) => {
        const value = modalAnswers[q.key] ?? "";
        if (q.answerType === "NUMBER") {
          return {
            questionKey: q.key,
            answerType: q.answerType,
            answerNumber: typeof value === "string" && value ? Number(value) : null,
            answerText: null,
            answerBoolean: null,
            answerJson: null,
          };
        }
        if (q.answerType === "BOOLEAN") {
          return {
            questionKey: q.key,
            answerType: q.answerType,
            answerBoolean: typeof value !== "string" || value === "" ? null : value === "true",
            answerText: null,
            answerNumber: null,
            answerJson: null,
          };
        }
        if (q.answerType === "MULTI_SELECT") {
          const selected = Array.isArray(value) ? value : [];
          return {
            questionKey: q.key,
            answerType: q.answerType,
            answerText: null,
            answerNumber: null,
            answerBoolean: null,
            answerJson: selected,
          };
        }
        return {
          questionKey: q.key,
          answerType: q.answerType,
          answerText: typeof value === "string" ? value || null : null,
          answerNumber: null,
          answerBoolean: null,
          answerJson: null,
        };
      });

      const res = await fetch(`/api/admin/users/${modalUser.id}/onboarding/answers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          educationLevel: modalLevel,
          answers: payloadAnswers,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to upload answers");
      }
      toast.success("Onboarding answers uploaded");
      closeQuestionModal();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload answers");
    } finally {
      setModalSaving(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Users</h2>
          <p className="text-sm text-gray-500 mt-1">Total: {users.length}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Username</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Verified</th>
                <th className="px-4 py-3 text-left">Profile</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Completion</th>
                <th className="px-4 py-3 text-left">Study Level</th>
                <th className="px-4 py-3 text-left">Phase 1 Input</th>
                <th className="px-4 py-3 text-left">Question Form</th>
                <th className="px-4 py-3 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{user.name || "-"}</td>
                  <td className="px-4 py-3">{user.username || "-"}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3">
                    {user.isVerified || user.isEmailVerified ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    {user.userProfile ? user.userProfile.id : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {user.userProfile ? user.userProfile.profileStatus : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {user.userProfile
                      ? `${user.userProfile.completionPercentage}%`
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {user.userProfile?.onboardingInfo?.educationLevel || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={educationDraft[user.id] || ""}
                        onChange={(e) =>
                          setEducationDraft((prev) => ({
                            ...prev,
                            [user.id]: e.target.value as EducationLevelValue,
                          }))
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-xs bg-white"
                      >
                        {educationOptions.map((option) => (
                          <option key={option.value || "empty"} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => saveEducationLevel(user.id)}
                        disabled={savingByUser[user.id]}
                        className="px-2 py-1 rounded bg-blue-600 text-white text-xs disabled:opacity-60"
                      >
                        {savingByUser[user.id] ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openQuestionModal(user)}
                      className="px-2 py-1 rounded bg-gray-900 text-white text-xs"
                    >
                      Fill Questions
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalUser && modalLevel && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[85vh] overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Onboarding Questions</h3>
                <p className="text-sm text-gray-600">
                  {modalUser.email} • {modalLevel}
                </p>
              </div>
              <button onClick={closeQuestionModal} className="text-gray-500 hover:text-gray-900">
                Close
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[65vh] space-y-4">
              {modalLoading ? (
                <div className="text-gray-600">Loading questions...</div>
              ) : modalQuestions.length === 0 ? (
                <div className="text-gray-600">No questions configured for this level yet.</div>
              ) : (
                modalQuestions.map((q, index) => (
                  <div key={q.key} className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      {index + 1}. {q.label}
                      {q.required ? <span className="text-red-600"> *</span> : null}
                    </p>
                    {q.answerType === "SINGLE_SELECT" ? (
                      <select
                        value={typeof modalAnswers[q.key] === "string" ? (modalAnswers[q.key] as string) : ""}
                        onChange={(e) =>
                          setModalAnswers((prev) => ({ ...prev, [q.key]: e.target.value }))
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      >
                        <option value="">Select</option>
                        {(q.options || []).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : q.answerType === "MULTI_SELECT" ? (
                      <div className="grid grid-cols-2 gap-2">
                        {(q.options || []).map((option) => {
                          const selected = Array.isArray(modalAnswers[q.key])
                            ? (modalAnswers[q.key] as string[])
                            : [];
                          const checked = selected.includes(option);
                          return (
                            <label key={option} className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {
                                  const current = Array.isArray(modalAnswers[q.key])
                                    ? [...(modalAnswers[q.key] as string[])]
                                    : [];
                                  let next = current;
                                  if (checked) {
                                    next = current.filter((x) => x !== option);
                                  } else {
                                    if (q.key === "country_preferences" && current.length >= 2) {
                                      toast.error("Maximum 2 countries allowed");
                                      return;
                                    }
                                    next = [...current, option];
                                  }
                                  setModalAnswers((prev) => ({ ...prev, [q.key]: next }));
                                }}
                              />
                              <span>{option}</span>
                            </label>
                          );
                        })}
                      </div>
                    ) : q.answerType === "NUMBER" ? (
                      <input
                        type="number"
                        value={typeof modalAnswers[q.key] === "string" ? (modalAnswers[q.key] as string) : ""}
                        onChange={(e) =>
                          setModalAnswers((prev) => ({ ...prev, [q.key]: e.target.value }))
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        placeholder="Enter number"
                      />
                    ) : (
                      <input
                        type="text"
                        value={typeof modalAnswers[q.key] === "string" ? (modalAnswers[q.key] as string) : ""}
                        onChange={(e) =>
                          setModalAnswers((prev) => ({ ...prev, [q.key]: e.target.value }))
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        placeholder="Enter answer"
                      />
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={closeQuestionModal}
                className="px-4 py-2 rounded border border-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={uploadModalAnswers}
                disabled={modalLoading || modalSaving}
                className="px-4 py-2 rounded bg-blue-600 text-white text-sm disabled:opacity-60"
              >
                {modalSaving ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const page = () => {
  const pathname = usePathname();

  switch (true) {
    case pathname.endsWith("/select"):
      return <UniversityManagement />;

    case pathname.endsWith("/stay"):
      return <NotIntegrated />;

    case pathname.endsWith("/connect"):
      return <NotIntegrated />;

    case pathname.endsWith("/community"):
      return <NotIntegrated />;

    case pathname.endsWith("/lenders"):
      return <NotIntegrated />;

    case pathname.endsWith("/users"):
      return <UsersTable />;

  }

  return <div>Not Integrated Yet.......</div>;
};

export default page;
