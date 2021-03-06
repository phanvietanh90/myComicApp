package com.comic.backend.user;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepository extends JpaRepository<UserEntity, Integer> {
    UserEntity findByUserNameEquals(String userName);
    UserEntity findByIdEquals(Integer userId);
    int countByUserName(String userName);

}
