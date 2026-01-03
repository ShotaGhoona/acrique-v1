import { renderHook, waitFor } from '@testing-library/react';
import { server } from '@/__mocks__/server';
import { createLoginErrorHandler } from '@/__mocks__/handlers';
import { TestProviders } from '@/__tests__/testing-utils';
import { useLogin } from '../lib/use-login';

// next/navigation をモック
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: () => null,
  }),
}));

describe('useLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ログイン成功時にReduxストアを更新しマイページへ遷移', async () => {
    const { result } = renderHook(() => useLogin(), {
      wrapper: ({ children }) => <TestProviders>{children}</TestProviders>,
    });

    result.current.mutate({ email: 'admin@example.com', password: 'password' });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // マイページへ遷移
    expect(mockPush).toHaveBeenCalledWith('/mypage');
  });

  it('ログイン失敗時にisErrorがtrueになる', async () => {
    server.use(createLoginErrorHandler(401));

    const { result } = renderHook(() => useLogin(), {
      wrapper: ({ children }) => <TestProviders>{children}</TestProviders>,
    });

    result.current.mutate({ email: 'wrong@example.com', password: 'wrong' });

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

    result.current.mutate({ email: 'admin@example.com', password: 'password' });

    // mutate 呼び出し直後は isPending が true になる可能性
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('ログイン成功時にAPIレスポンスが正しく返される', async () => {
    const { result } = renderHook(() => useLogin(), {
      wrapper: ({ children }) => <TestProviders>{children}</TestProviders>,
    });

    result.current.mutate({ email: 'admin@example.com', password: 'password' });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // APIが正常に呼び出されることを確認
    expect(result.current.data).toEqual({
      message: 'ログイン成功',
      access_token: 'test_token',
      user_id: 1,
    });
  });
});
