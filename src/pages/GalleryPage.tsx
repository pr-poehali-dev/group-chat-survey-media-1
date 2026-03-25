import { useState } from "react";
import { mediaItems, chats } from "@/data/mockData";
import Icon from "@/components/ui/icon";

export default function GalleryPage() {
  const [filterChat, setFilterChat] = useState("all");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [layout, setLayout] = useState<"grid" | "masonry">("grid");

  const filtered = mediaItems.filter(
    (item) => filterChat === "all" || item.chatId === filterChat
  );

  const selected = mediaItems.find((i) => i.id === selectedItem);

  const toggleLike = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-xl text-white">Галерея</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} медиафайлов</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLayout("grid")}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${layout === "grid" ? "bg-purple-500/20 text-purple-400" : "bg-white/5 text-muted-foreground"}`}
          >
            <Icon name="Grid3X3" size={16} />
          </button>
          <button
            onClick={() => setLayout("masonry")}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${layout === "masonry" ? "bg-purple-500/20 text-purple-400" : "bg-white/5 text-muted-foreground"}`}
          >
            <Icon name="LayoutGrid" size={16} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-400 text-white text-sm font-medium hover:opacity-90 transition-opacity neon-glow-purple">
            <Icon name="Upload" size={14} />
            Загрузить
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterChat("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all ${
            filterChat === "all"
              ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-white"
              : "bg-white/5 text-muted-foreground hover:text-white"
          }`}
        >
          Все
        </button>
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => setFilterChat(chat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all ${
              filterChat === chat.id
                ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-white"
                : "bg-white/5 text-muted-foreground hover:text-white"
            }`}
          >
            {chat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className={`grid gap-3 ${layout === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-2 md:grid-cols-3"}`}>
        {filtered.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item.id)}
            className={`relative group cursor-pointer rounded-2xl overflow-hidden animate-fade-in hover-lift ${
              layout === "masonry" && idx % 3 === 1 ? "row-span-2" : ""
            }`}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <img
              src={item.url}
              alt={item.uploadedBy}
              className="w-full h-full object-cover"
              style={{ height: layout === "masonry" && idx % 3 === 1 ? "280px" : "180px" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <p className="text-white text-xs font-medium">{item.uploadedBy}</p>
                  <p className="text-white/60 text-xs">{item.chatName}</p>
                </div>
                <button
                  onClick={(e) => toggleLike(item.id, e)}
                  className="flex items-center gap-1 text-xs text-white bg-white/15 backdrop-blur-sm px-2 py-1 rounded-full hover:bg-white/25 transition-colors"
                >
                  <Icon name={likedItems.has(item.id) ? "Heart" : "Heart"} size={11} className={likedItems.has(item.id) ? "text-pink-400 fill-pink-400" : ""} />
                  {item.likes + (likedItems.has(item.id) ? 1 : 0)}
                </button>
              </div>
            </div>
            {/* Chat badge */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                {item.chatName.split(" ")[0]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedItem && selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div className="relative max-w-3xl w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <img
              src={selected.url}
              alt={selected.uploadedBy}
              className="w-full rounded-2xl"
            />
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white font-medium">{selected.uploadedBy}</p>
                  <p className="text-white/60 text-sm">{selected.chatName} · {selected.uploadedAt}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleLike(selected.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      likedItems.has(selected.id)
                        ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <Icon name="Heart" size={16} className={likedItems.has(selected.id) ? "fill-pink-400" : ""} />
                    {selected.likes + (likedItems.has(selected.id) ? 1 : 0)}
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all">
                    <Icon name="Download" size={16} />
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <Icon name="X" size={18} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}