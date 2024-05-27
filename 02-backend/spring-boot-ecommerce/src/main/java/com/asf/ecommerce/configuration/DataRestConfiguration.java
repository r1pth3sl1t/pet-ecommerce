package com.asf.ecommerce.configuration;

import com.asf.ecommerce.entity.Country;
import com.asf.ecommerce.entity.Product;
import com.asf.ecommerce.entity.ProductCategory;
import com.asf.ecommerce.entity.State;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.LinkedList;
import java.util.List;
import java.util.Set;

@Configuration
public class DataRestConfiguration implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Value("${allowed.origins}")
    private String[] allowedOrigins;

    @Value("${spring.data.rest.base-path}")
    private String basePath;

    @Autowired
    public DataRestConfiguration(EntityManager entityManager){
        this.entityManager = entityManager;
    }
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        HttpMethod[] unsupportedReadOnlyActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH};
        disableHttpMethods(config, unsupportedReadOnlyActions, Product.class);
        disableHttpMethods(config, unsupportedReadOnlyActions, ProductCategory.class);
        disableHttpMethods(config, unsupportedReadOnlyActions, Country.class);
        disableHttpMethods(config, unsupportedReadOnlyActions, State.class);
        exposeIds(config);

        cors.addMapping(config.getBasePath() + "/**").allowedOrigins(allowedOrigins);
    }

    private void disableHttpMethods(RepositoryRestConfiguration config, HttpMethod[] unsupportedActions, Class<?> clazz) {
        config.getExposureConfiguration()
                .forDomainType(clazz)
                .withItemExposure(
                        (metdata, httpMethods) -> httpMethods.disable(unsupportedActions)
                )
                .withCollectionExposure(
                        (metdata, httpMethods) -> httpMethods.disable(unsupportedActions)
                );
    }

    private void exposeIds(RepositoryRestConfiguration config) {

        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        List<Class<?>> entityClasses = new LinkedList<>();

        for(EntityType<?> entity: entities) {
            entityClasses.add(entity.getJavaType());
        }

        Class<?>[] domainTypes = entityClasses.toArray(new Class[0]);

        config.exposeIdsFor(domainTypes);
    }


}
