package com.ramble.mymomentum;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableConfigurationProperties
@ComponentScan({
        "com.ramble.mymomentum"
})
@EnableJpaRepositories({"com.ramble.mymomentum.repository", "com.ramble.mymomentum.user"})
@EntityScan({"com.ramble.mymomentum.entity", "com.ramble.mymomentum.user"})
public class MyMomentumApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyMomentumApplication.class, args);
    }
} 