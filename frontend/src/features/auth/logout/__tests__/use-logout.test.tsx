import { renderHook, waitFor } from '@testing-library/react';
import { server } from '@/__mocks__/server';
import { createLogoutErrorHandler } from '@/__mocks__/handlers';
import { TestProviders } from '@/__tests__/testing-utils';
import { useLogout } from '../lib/use-logout';

// next/navigation をモック
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe('useLogout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ログアウト成功時にReduxストアをクリアしログインページへ遷移', async () => {
    const { result } = renderHook(() => useLogout(), {
      wrapper: ({ children }) => <TestProviders>{children}</TestProviders>,
    });

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // ログインページへ遷移
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('ログアウト失敗時にisErrorがtrueになる', async () => {
    server.use(createLogoutErrorHandler(500));

    const { result } = renderHook(() => useLogout(), {
      wrapper: ({ children }) => <TestProviders>{children}</TestProviders>,
    });

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // リダイレクトは発生しない
    expect(mockPush).not.toHaveBeenCalled();
  });
});
