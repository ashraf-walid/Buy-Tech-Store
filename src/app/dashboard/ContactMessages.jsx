"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, User, MessageSquare, Calendar, Search, Trash2, Eye, EyeOff } from "lucide-react";
import useContactStore from "@/store/contactStore";

export default function ContactMessages() {
  const { messages, isLoading, fetchMessages, deleteMessage } = useContactStore();
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [expandedIds, setExpandedIds] = useState(new Set());

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    let result = messages;

    if (search.trim()) {
      const term = search.toLowerCase();
      result = messages.filter(
        (msg) =>
          msg.name?.toLowerCase().includes(term) ||
          msg.email?.toLowerCase().includes(term) ||
          msg.subject?.toLowerCase().includes(term) ||
          msg.message?.toLowerCase().includes(term) ||
          msg.phone?.toLowerCase().includes(term)
      );
    }

    setFiltered(result);
  }, [search, messages]);

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;

    const result = await deleteMessage(id);
    if (!result.success) {
      alert("حدث خطأ أثناء حذف الرسالة");
    }
  };

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الرسائل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <span className="text-blue-600">📧</span>
          إدارة الرسائل
        </h1>
        <p className="text-gray-600">عرض وإدارة رسائل العملاء</p>
      </div>

      {/* Search and Stats Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="🔍 البحث في الرسائل..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          <div className="flex gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white flex justify-center items-center gap-3 px-6 py-3 rounded-xl shadow-md">
              <div className="text-sm opacity-90">إجمالي الرسائل</div>
              <div className="text-2xl font-bold">{messages.length}</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white flex justify-center items-center gap-3 px-6 py-3 rounded-xl shadow-md">
              <div className="text-sm opacity-90">النتائج</div>
              <div className="text-2xl font-bold">{filtered.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((msg) => {
            const isExpanded = expandedIds.has(msg._id);
            const messagePreview = msg.message?.length > 150
              ? msg.message.substring(0, 150) + "..."
              : msg.message;

            return (
              <div
                key={msg._id}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="p-6">
                  {/* Message Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {msg.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            {msg.name || "بدون اسم"}
                          </h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {msg.email}
                            </span>
                            {msg.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {msg.phone}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(msg.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {msg.subject && (
                        <div className="mb-3">
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                            {msg.subject}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleExpand(msg._id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title={isExpanded ? "إخفاء" : "عرض كامل"}
                      >
                        {isExpanded ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="bg-gray-50 rounded-lg p-4 border-r-4 border-blue-500">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {isExpanded ? msg.message : messagePreview}
                      </p>
                    </div>
                    {msg.message?.length > 150 && !isExpanded && (
                      <button
                        onClick={() => toggleExpand(msg._id)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                      >
                        عرض المزيد...
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="text-6xl opacity-20">📭</div>
              <p className="text-gray-500 text-lg">لا توجد رسائل</p>
              <p className="text-gray-400 text-sm">
                {search ? "لم يتم العثور على نتائج للبحث" : "لم يتم استلام أي رسائل بعد"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

