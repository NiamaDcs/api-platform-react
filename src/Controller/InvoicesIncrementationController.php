<?php 

namespace App\Controller;

use App\Entity\Invoice;
use Doctrine\ORM\EntityManagerInterface;

class InvoicesIncrementationController {

    /**
     * 
     *
     * @var [EntityManager]
     */
    private $em;

    public function __construct(EntityManagerInterface $em) 
    {
        $this->em = $em;
    }

    /**
     * 
     *
     * @param Invoice $data
     * @return void
     */
    public function __invoke(Invoice $data) 
    {
        $data->setChrono($data->getChrono() + 1);
        $this->em->flush();
        return $data;
    }
}