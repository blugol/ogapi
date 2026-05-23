import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured);

  // 로컬 스토리지에서 데모 유저 정보 로드
  useEffect(() => {
    if (!isSupabaseConfigured) {
      const savedUser = localStorage.getItem('ogapiro_demo_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
      return;
    }

    // Supabase 세션 취득
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 인증 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 카카오 로그인
  const loginWithKakao = async () => {
    if (!isSupabaseConfigured) {
      // 데모 모드: Kakao Sync 가상 사용자 생성 및 1.5초 후 로그인 처리
      setLoading(true);
      return new Promise((resolve) => {
        setTimeout(() => {
          const demoUser = {
            id: 'demo_kakao_user_12345',
            email: 'user@kakao.com',
            user_metadata: {
              full_name: '홍길동 (데모)',
              avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=kakao',
              phone: '010-1234-5678',
              // 카카오 싱크로 가져온 가상의 배송지 목록
              delivery_addresses: [
                {
                  id: 'addr_1',
                  name: '우리집 (기본)',
                  recipient: '홍길동',
                  phone: '010-1234-5678',
                  zipcode: '06132',
                  baseAddress: '서울시 강남구 테헤란로 152',
                  detailAddress: '강남파이낸스센터 19층',
                },
                {
                  id: 'addr_2',
                  name: '회사',
                  recipient: '홍길동 대리',
                  phone: '010-9876-5432',
                  zipcode: '04535',
                  baseAddress: '서울시 중구 을지로 100',
                  detailAddress: '파인에비뉴 B동 7층',
                }
              ]
            }
          };
          localStorage.setItem('ogapiro_demo_user', JSON.stringify(demoUser));
          setUser(demoUser);
          setLoading(false);
          resolve(demoUser);
        }, 1200);
      });
    }

    // 실제 Supabase Kakao OAuth
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: window.location.origin,
        // Kakao Sync를 통한 배송 정보 및 전화번호 요청이 설정된 경우
        queryParams: {
          prompt: 'login select_account'
        }
      }
    });
    if (error) throw error;
  };

  // 구글 로그인
  const loginWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      setLoading(true);
      return new Promise((resolve) => {
        setTimeout(() => {
          const demoUser = {
            id: 'demo_google_user_67890',
            email: 'user@gmail.com',
            user_metadata: {
              full_name: '김철수 (데모)',
              avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=google',
              phone: '010-5678-1234',
              delivery_addresses: [
                {
                  id: 'addr_g1',
                  name: '본가',
                  recipient: '김철수',
                  phone: '010-5678-1234',
                  zipcode: '48058',
                  baseAddress: '부산시 해운대구 우동 140',
                  detailAddress: '마린시티아파트 101동 2402호',
                }
              ]
            }
          };
          localStorage.setItem('ogapiro_demo_user', JSON.stringify(demoUser));
          setUser(demoUser);
          setLoading(false);
          resolve(demoUser);
        }, 1200);
      });
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
  };

  // 로그아웃
  const logout = async () => {
    if (!isSupabaseConfigured) {
      localStorage.removeItem('ogapiro_demo_user');
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
  };

  return {
    user,
    loading,
    isLoggedIn: !!user,
    isDemoMode,
    loginWithKakao,
    loginWithGoogle,
    logout
  };
}
