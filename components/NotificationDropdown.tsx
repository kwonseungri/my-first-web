"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { NotificationWithDetails } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function NotificationDropdown() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationWithDetails[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const supabase = createClient();
    fetchNotifications(supabase);

    const channel = supabase
      .channel("realtime:dropdown_notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // 새 알림이 오면 목록 다시 불러오기
          fetchNotifications(supabase);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchNotifications = async (supabase: any) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("notifications")
      .select(`
        *,
        actor:profiles!notifications_actor_id_fkey(username, avatar_url),
        post:posts(title),
        comment:comments(content)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Failed to fetch notifications", error);
      return;
    }

    const typedData = data as unknown as NotificationWithDetails[];
    setNotifications(typedData);
    setUnreadCount(typedData.filter((n) => !n.is_read).length);
  };

  const handleNotificationClick = async (notification: NotificationWithDetails) => {
    const supabase = createClient();
    
    if (!notification.is_read) {
      // 읽음 처리
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notification.id);
      
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    if (notification.type === 'follow') {
      router.push("/mypage");
    } else if (notification.post_id) {
      router.push(`/posts/${notification.post_id}`);
    }
  };

  if (!user) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b bg-card">
          <h4 className="font-semibold text-sm">알림</h4>
        </div>
        <ScrollArea className="h-[300px] bg-card text-card-foreground">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              새로운 알림이 없습니다.
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex flex-col gap-1 p-4 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0 ${
                    !notif.is_read ? "bg-muted/30" : ""
                  }`}
                >
                  {notif.type === 'follow' ? (
                    <div className="text-sm">
                      <span className="font-medium">{notif.actor?.username || "알 수 없는 사용자"}</span>님이 회원님을 이웃으로 추가했습니다.
                    </div>
                  ) : (
                    <>
                      <div className="text-sm">
                        <span className="font-medium">{notif.actor?.username || "알 수 없는 사용자"}</span>님이{" "}
                        <span className="font-medium">'{notif.post?.title}'</span> 글에 댓글을 남겼습니다.
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {notif.comment?.content}
                      </div>
                    </>
                  )}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
