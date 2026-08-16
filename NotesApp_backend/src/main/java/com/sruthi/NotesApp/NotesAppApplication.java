package com.sruthi.NotesApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication    // @Configuration + @EnableAutoConfiguration + @ComponentScan

// @Configuration - marks the class as a source of bean definitions
// @EnableAutoConfiguration - automatically configures tomcat server, DB connection, security, Jackson based on pom.xml and application.properties
// @ComponentScan - scans for @Component, @Service, @Repository, @Controller, @RestController

@ComponentScan(basePackages = "com.sruthi.NotesApp")
// root for component scan

// starting point of entire application
public class NotesAppApplication {

	// when this file is run:
	// JVM starts
	// Springboot bootstraps the application
	// It scans, configures, and wires everything automatically
	// App becomes ready to handle requests

	public static void main(String[] args) {
		SpringApplication.run(NotesAppApplication.class, args);
	/*
		creates SpringApplication instance, stores configuration sources
		detects app type. servlet app -> Tomcat, reactive app -> Netty, CLI app -> no server
		creates ApplicationContext (IoC container)
			IoC container. stores beans. manages lifecycles
		starts component scanning. registers bean definitions
		applies auto-configurations
		instantiates beans. creates all singleton beans at startup unless - @Lazy
		performs dependency injection
		runs lifecycle callbacks like:
			@PostConstruct - runs after the bean has been created and its dependencies injected
			CommandLineRunner - runs after the Spring application context has been initialized
			ApplicationRunner - similar to CommandLineRunner, but receives parsed application arguments
		starts embedded server and starts listening
		app ready. accepts HTTP requests
	*/

	}
}

//### Beans
// an obj that Spring creates and manages for you
// without Spring, you're responsible for creating objs, managing lifecycles and passing dependencies manually
// with Spring, it automatically creates obj, stores it and gives it wherever needed

// Spring knows what to create based on annotations
// @Component - generic
// @Service - business logic
// @Repository - database logic
// @Controller - web layer for Spring MVC - returns views
// @RestController - web layer for REST - returns JSON


// IoC - Inversion of Control
// instead of you controlling obj creation, Spring takes control of it
// IoC container creates beans, injects dependencies and manages lifecycle
// uses dependency injection


// Spring usually does Eager Initialization - creates all beans at startup
// this causes slow startup and unused beans are still created
// Lazy Loading - Bean is created only when needed. errors appear later
// @Lazy

// Springboot starts -> IoC Container created -> container scans classes -> creates beans -> injects dependencies
// -> (Optional) Lazy beans created later