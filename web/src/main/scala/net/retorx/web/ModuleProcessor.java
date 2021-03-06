package net.retorx.web;

import com.google.inject.*;
import org.jboss.logging.Logger;
import org.jboss.resteasy.plugins.guice.GuiceResourceFactory;
import org.jboss.resteasy.spi.Registry;
import org.jboss.resteasy.spi.ResourceFactory;
import org.jboss.resteasy.spi.ResteasyProviderFactory;
import org.jboss.resteasy.util.GetRestful;

import javax.ws.rs.ext.Provider;
import java.lang.reflect.Type;

public class ModuleProcessor
{
   private final static Logger logger = Logger.getLogger(ModuleProcessor.class);

   private final Registry registry;
   private final ResteasyProviderFactory providerFactory;

   public ModuleProcessor(final Registry registry, final ResteasyProviderFactory providerFactory)
   {
      this.registry = registry;
      this.providerFactory = providerFactory;
   }

   public Injector process(final Module... modules)
   {
      final Injector injector = Guice.createInjector(modules);
      // processInjector(injector);
       return injector;
   }

   private void processInjector(final Injector injector)
   {
      for (final Binding<?> binding : injector.getBindings().values())
      {
         final Type type = binding.getKey().getTypeLiteral().getType();
         if (type instanceof Class)
         {
            final Class<?> beanClass = (Class) type;
            if (GetRestful.isRootResource(beanClass))
            {
               final ResourceFactory resourceFactory = new GuiceResourceFactory(binding.getProvider(), beanClass);
               logger.info("registering factory for " + beanClass.getName());
               registry.addResourceFactory(resourceFactory);
            }
            if (beanClass.isAnnotationPresent(Provider.class))
            {
               logger.info("registering provider instance for " + beanClass.getName());
               providerFactory.registerProviderInstance(binding.getProvider().get());
            }
         }
      }
   }
}
