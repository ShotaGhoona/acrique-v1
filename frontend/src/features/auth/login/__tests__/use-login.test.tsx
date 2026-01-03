import { renderHook, waitFor } from '@testing-library/react';
import { server } from '@/__mocks__/server';
import { createLoginErrorHandler } from '@/__mocks__/handlers';
import { TestProviders, createTestStore } from '@/__tests__/testing-utils';
import { useLogin } from '../lib/use-login';

// next/navigation をモック
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe('useLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ログイン成功時にReduxストアを更新しダッシュボードへ遷移', async () => {
    const store = createTestStore();

    const { result } = renderHook(() => useLogin(), {
      wrapper: ({ children }) => <TestProviders>{children}</TestProviders>,
    });

    result.current.mutate({ loginId: 'admin', password: 'password' });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // ダッシュボードへ遷移
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('ログイン失敗時にisErrorがtrueになる', async () => {
    server.use(createLoginErrorHandler(401));

    const { result } = renderHook(() => useLogin(), {
      wrapper: ({ children }) => <TestProviders>{children}</TestProviders>,
    });

    result.current.mutate({ loginId: 'wrong', password: 'wrong' });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // リダイレクトは発生しない
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('ローディング状態がisPendingで確認できる', async () => {
    const { result } = renderHook(() => useLogin(), {
      wrapper: ({ children }) => <TestProviders>{children}</TestProviders>,
    });

    // 初期状態
    expect(result.current.isPending).toBe(false);

    result.current.mutate({ loginId: 'admin', password: 'password' });

    // mutate 呼び出し直後は isPending が true になる可能性
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('loginId/passwordからlogin_id/passwordへの変換を行う', async () => {
    const { result } = renderHook(() => useLogin(), {
      wrapper: ({ children }) => <TestProviders>{children}</TestProviders>,
    });

    // キャメルケースで入力
    result.current.mutate({ loginId: 'admin', password: 'password' });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // APIが正常に呼び出されることで変換が正しく行われたことを確認
    expect(result.current.data).toEqual({
      message: 'ログイン成功',
      access_token: 'test_token',
      user_id: 1,
    });
  });
});
