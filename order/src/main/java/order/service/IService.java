package order.service;

import java.util.List;
import java.util.Optional;

public interface IService<T, K> {
    List<T> findAll();

    Optional<T> findById(K id);

    T save(T entity);

    Optional<T> deleteById(K id);
}
