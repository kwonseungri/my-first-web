"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function NotificationListener() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const supabase = createClient();

    const channel = supabase
      .channel('realtime:toast_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          const notif = payload.new;

          // 추가적인 세부 정보 조회 (작성자 이름, 글 제목)
          const { data, error } = await supabase
            .from('notifications')
            .select(`
              actor:profiles!notifications_actor_id_fkey(username),
              post:posts(title),
              comment:comments(content)
            `)
            .eq('id', notif.id)
            .single();

          if (error || !data) return;

          const actorName = (data.actor as any)?.username || "알 수 없는 사용자";

          if (notif.type === 'follow') {
            toast.success(`${actorName}님이 회원님을 이웃으로 추가했습니다.`, {
              action: {
                label: "내 프로필",
                onClick: () => router.push(`/mypage`)
              }
            });
          } else {
            const postTitle = (data.post as any)?.title || "게시글";
            const commentContent = (data.comment as any)?.content || "";

            toast.success(`'${postTitle}' 글에 ${actorName}님이 새 댓글을 달았습니다.`, {
              description: commentContent.length > 20 ? commentContent.substring(0, 20) + "..." : commentContent,
              action: {
                label: "보기",
                onClick: () => router.push(`/posts/${notif.post_id}`)
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, router]);

  return null; // UI를 렌더링하지 않는 백그라운드 컴포넌트
}
