"""UserRepositoryインターフェースのテスト"""

import inspect

from app.domain.repositories.user_repository import IUserRepository


class TestUserRepositoryInterface:
    """UserRepositoryインターフェースのテストクラス"""

    def test_is_abstract_class(self):
        """IUserRepositoryが抽象クラスであることを確認"""
        assert inspect.isabstract(IUserRepository)

    def test_has_get_by_email_method(self):
        """get_by_emailメソッドが定義されている"""
        assert hasattr(IUserRepository, 'get_by_email')
        assert callable(IUserRepository.get_by_email)

    def test_has_get_by_id_method(self):
        """get_by_idメソッドが定義されている"""
        assert hasattr(IUserRepository, 'get_by_id')
        assert callable(IUserRepository.get_by_id)

    def test_has_create_method(self):
        """createメソッドが定義されている"""
        assert hasattr(IUserRepository, 'create')
        assert callable(IUserRepository.create)

    def test_has_update_method(self):
        """updateメソッドが定義されている"""
        assert hasattr(IUserRepository, 'update')
        assert callable(IUserRepository.update)

    def test_has_delete_method(self):
        """deleteメソッドが定義されている"""
        assert hasattr(IUserRepository, 'delete')
        assert callable(IUserRepository.delete)

    def test_has_update_password_method(self):
        """update_passwordメソッドが定義されている"""
        assert hasattr(IUserRepository, 'update_password')
        assert callable(IUserRepository.update_password)

    def test_has_verify_email_method(self):
        """verify_emailメソッドが定義されている"""
        assert hasattr(IUserRepository, 'verify_email')
        assert callable(IUserRepository.verify_email)

    def test_method_signatures(self):
        """メソッドのシグネチャを確認"""
        # get_by_email
        sig = inspect.signature(IUserRepository.get_by_email)
        assert 'email' in sig.parameters

        # get_by_id
        sig = inspect.signature(IUserRepository.get_by_id)
        assert 'user_id' in sig.parameters

        # create
        sig = inspect.signature(IUserRepository.create)
        assert 'user' in sig.parameters

        # update
        sig = inspect.signature(IUserRepository.update)
        assert 'user' in sig.parameters

        # delete
        sig = inspect.signature(IUserRepository.delete)
        assert 'user_id' in sig.parameters

        # update_password
        sig = inspect.signature(IUserRepository.update_password)
        assert 'user_id' in sig.parameters
        assert 'password_hash' in sig.parameters

        # verify_email
        sig = inspect.signature(IUserRepository.verify_email)
        assert 'user_id' in sig.parameters
        assert 'verified_at' in sig.parameters

    def test_cannot_instantiate_directly(self):
        """抽象クラスは直接インスタンス化できない"""
        try:
            IUserRepository()
            assert False, 'Should not be able to instantiate abstract class'
        except TypeError:
            # 期待通り：抽象クラスはインスタンス化できない
            pass
