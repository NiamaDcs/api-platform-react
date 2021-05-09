<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Customer;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class CustomerUserSubscriber implements EventSubscriberInterface {

    private $security;

    public function __construct(Security $security) 
    {
        $this->security = $security;
    }
 
    public static function getSubscribedEvents()
    {
        /**
         * avant la validation
         */
        return [
            KernelEvents::VIEW => ['setUserForCustomer', EventPriorities::PRE_VALIDATE]
        ]; 
    }

    public function setUserForCustomer(ViewEvent $event)
    {
        $customer = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if($customer instanceof Customer && $method === 'POST'){
            
            //choper l'utilisateur actuellement 
            $user = $this->security->getUser();

            //Assigner l'utilisateur au customer qu'on est en train de créer 
            $customer->setUser($user);

        }
       


        
    }
}