import { Typography } from '@mui/material'
import React from 'react'
import { TypographyText, TypographyTitle } from './TermsOfService'


const Terms: React.FC<{ index: number; value: number }> = ({ index, value }) => {

    if (value !== index) return null

    return (
        <>
            <TypographyTitle>
                TERMS OF SERVICE
            </TypographyTitle>

            <Typography
                fontWeight={600}
                fontSize={'body1'}
                color={'white'}
            >
                Last updated: May 23, 2022
            </Typography>

            <TypographyText>
                GGNFTBOX (“we,” “us,” “our”) provides its marketplace and services (described below) to you (“you” or
                “User“) through its website, platform, and marketplace located at www.ggnftbox.com (the “Platform”),
                subject to the following Terms of Service (the “Terms”). These Terms govern your access to the creation,
                purchase, sale, exchange, or modification of Digital Collectible (as defined below). By signing up for
                an account on the Platform or otherwise using or accessing the Platform, you acknowledge that you have
                read and agree to these Terms. GGNFTBOX reserves the right to change or modify the Terms, and any such
                modification will be in effect as of the “Last updated” referred to at the top of this page. You must
                review these Terms before using the Platform or using any services that are available through the
                Platform. If you do not agree to these Terms, you may not access or use the Platform.
            </TypographyText>

            <TypographyTitle>
                1. INTRODUCTION
            </TypographyTitle>

            <TypographyText>
                GGNFTBOX allows gamers, bloggers, streamers and other individuals (“Creators”) to create Digital
                Collectibles in the form of NFT Moments (as defined below) and make it available for sale on the
                Platform. Collectors (“Collectors”) have the opportunity to showcase, sell, purchase, collect, exchange,
                list for auction, make offers, and bid on (each a “Transaction”) unique Digital Collectibles represented
                on a non-fungible token implemented on the Flow™ blockchain platform (the “Flow Network”) through the
                use of a smart contract. Registered Accounts (as defined below) may participate in a Transaction in two
                ways:
                <br/>
                (a) by purchasing packs of Digital Collectibles from the Creator (each, a “NFT BOX”);
                <br/>
                (b) by purchasing Digital Collectibles from other users or Collectors on the Platform’s marketplace.
            </TypographyText>

            <TypographyText>
                ANY AND ALL DIGITAL COLLECTIBLES PURCHASED THROUGH A TRANSACTION, ON THE PLATFORM OR THROUGH THE
                SERVICES, WILL ENTITLE THE BUYER ONLY TO A LIMITED NON-SUBLICENSABLE RIGHT TO THE CONTENT. FOR THE
                AVOIDANCE OF DOUBT, BUYERS AND COLLECTORS MAY NOT RELICENSE OR SUBLICENSE ANY DIGITAL COLLECTIBLE OR
                ASSOCIATED CONTENT THEREIN.
            </TypographyText>

            <TypographyText>
                While GGNFTBOX offers a marketplace for Digital Collectibles, it does not buy, sell, or ever take
                custody or possession of any Digital Collectible. The Platform facilitates User collection of NFT
                Moments, but neither GGNFTBOX nor the Platform are custodians of any Digital Collectibles, NFT BOXes and
                NFT Moments. The User understands and acknowledges that the Smart Contracts do not give GGNFTBOX
                custody, possession, or control of any Digital Collectible or cryptocurrency at any time for the purpose
                of facilitating transactions on the Platform. You affirm that you are aware and acknowledge that
                GGNFTBOX is a non-custodial service provider and has designed this Platform to be directly accessible by
                the Users without any involvement or actions taken by GGNFTBOX or any third-party. As a marketplace,
                GGNFTBOX cannot make any representation or guarantee that Creators will achieve any particular outcome
                as the result of listing their Digital Collectibles on GGNFTBOX.
            </TypographyText>

            <TypographyTitle>
                2. ACCOUNT REGISTRATION AND CONNECTING WALLET
            </TypographyTitle>

            <TypographyText>
                Anyone can browse GGNFTBOX without registering for an account. You may be required to register with
                GGNFTBOX in order to access and use certain features on the Platform, such as participating as a Creator
                or Collector. If you choose to register for the Platform, you agree to provide and maintain true,
                accurate, current, and complete information about yourself as prompted by our registration form.
                Registration data and certain other information about you are governed by our Privacy Policy. You may
                use the Platform only if you are 18 years or older and capable of forming a binding contract with
                GGNFTBOX and are not barred from using the Platform under applicable law. You are responsible for
                anything that occurs when anyone is signed in to your account, as well as the security of the account.
            </TypographyText>

            <TypographyText>
                You are responsible for maintaining the confidentiality of your account and password, if any, and are
                fully responsible for any and all activities that occur under your password or account. You agree to
                this:
                <br/>
                (a) immediately notify GGNFTBOX of any unauthorized use of your password or account or any other breach
                of security;
                <br/>
                (b) ensure that you exit from your account at the end of each session when accessing GGNFTBOX.
            </TypographyText>

            <TypographyText>
                GGNFTBOX will not be liable for any loss or damage arising from your failure to comply with this
                Section.
                In order to participate as a Creator or Collector, you must connect to a Blocto and/or Payeer electronic
                wallet, which allows you to purchase, store, and engage in transactions.
            </TypographyText>

            <TypographyTitle>
                3. PAYMENTS
            </TypographyTitle>

            <TypographyText>
                GGNFTBOX currently uses Blocto Wallet and/or Payeer as our third party service provider for payment
                services. All payments or financial transactions that you engage in via the Platform will be conducted
                through either the Flow Network, Blocto Wallet and/or Payeer. We have no control over these payments or
                transactions, nor do we have the ability to reverse any payments or transactions. We do not provide
                refunds for any purchases that you might make on or through the Platform – whether for NFT BOXes, NFT
                Moments or anything else. All information that you provide us, the Flow Network, Blocto Wallet and/or
                Payeer or any third party payment service provider in connection with a purchase, Transaction or other
                monetary transaction interaction with or through our Service must be accurate, complete, and current.
                You agree to pay all charges incurred by users of your credit card, debit card, or other payment method
                (“Payment Method”) used in connection with a purchase or transaction or other monetary transaction
                interaction with our Service at the prices in effect when such charges are incurred.
            </TypographyText>

            <TypographyText>
                We neither own nor control the Flow network, Blocto Wallet and/or Payeer, your browser, or any other
                third party site, product, or service that you might access, visit, or use for the purpose of enabling
                you to use the various features of the Platform. We will not be liable for the acts or omissions of any
                such third parties, nor will we be liable for any damage that you may suffer as a result of your
                transactions or any other interaction with any such third parties. The User understands that your Flow
                public address will be made publicly visible whenever you engage in a transaction on the Platform.
            </TypographyText>

            <TypographyText>
                ANY TRANSACTION, PURCHASE OR SALE YOU MAKE, ACCEPT OR FACILITATE OUTSIDE OF THE SITE WILL BE ENTIRELY AT
                YOUR OWN RISK. WE DO NOT CONTROL OR ENDORSE PURCHASES OR SALES OUTSIDE OF THIS SITE. WE EXPRESSLY DENY
                ANY OBLIGATION TO INDEMNIFY YOU OR HOLD YOU HARMLESS FOR ANY LOSSES YOU MAY INCUR BY TRANSACTING, OR
                FACILITATING TRANSACTIONS, OUTSIDE OF THIS SITE. ALL TRANSACTIONS INITIATED THROUGH OUR SITE ARE
                FACILITATED AND RUN BY THIRD-PARTY ELECTRONIC WALLET EXTENSIONS, AND BY USING OUR SERVICES YOU AGREE
                THAT YOU ARE GOVERNED BY THE TERMS OF SERVICE AND PRIVACY POLICY FOR THE APPLICABLE EXTENSIONS. WE ARE
                NOT A BROKER, FINANCIAL INSTITUTION, OR CREDITOR. THE SITE IS AN ADMINISTRATIVE PLATFORM ONLY. WE
                FACILITATE TRANSACTIONS BETWEEN BUYERS, COLLECTORS, SELLERS AND CREATORS BUT IS NOT A PARTY TO ANY
                AGREEMENT BETWEEN THEM OR BETWEEN ANY USERS.
            </TypographyText>

            <TypographyTitle>
                4. INTELLECTUAL PROPERTY RIGHTS
                <br/>
                4.1 Creators Rights
            </TypographyTitle>

            <TypographyText>
                The Creator owns all legal rights, title, and interest in all intellectual property rights underlying
                the Digital Collectibles minted by the Creator on the Platform, including but not limited to copyrights
                and trademarks. As the copyright owner, the Creator has the right to reproduce, prepare derivative
                Digital Collectibles, distribute, and display or perform the Digital Collectibles.
            </TypographyText>

            <TypographyText>
                The Creator hereby acknowledges, understands, and agrees that selling a Digital Collectibles on GGNFTBOX
                constitutes an express representation, warranty, and covenant that the Creator has not, will not, and
                will not cause another to sell, tokenize, or create another cryptographic token representing a NFT
                Moment for the same digital asset.
            </TypographyText>

            <TypographyText>
                The Creator hereby acknowledges, understands, and agrees that launching a Digital Collectibles on
                GGNFTBOX constitutes an express and affirmative grant to GGNFTBOX, its affiliates and successors a
                non-exclusive, world-wide, assignable, sublicensable, perpetual, and royalty-free license to make copies
                of, display, perform, reproduce, and distribute the Digital Collectibles on any media whether now known
                or later discovered for the broad purpose of operating, promoting, sharing, developing, marketing, and
                advertising the Platform, or any other purpose related to GGNFTBOX.
            </TypographyText>

            <TypographyText>
                The Creator expressly represents and warrants that their Digital Collectibles listed on GGNFTBOX
                contains only original content otherwise authorized for use by the Creator, and does not contain
                unlicensed or unauthorized copyrighted content, including any imagery, design, audio, video, human
                likeness, or other unoriginal content not created by the Creator, not authorized for use by the Creator,
                not in the public domain, or otherwise without a valid claim of fair use, the Creator further represents
                and warrants that it has permission to incorporate the unoriginal content.
            </TypographyText>

            <TypographyTitle>
                4.2 Collectors Rights
            </TypographyTitle>

            <TypographyText>
                Collectors receive a cryptographic token representing the Creator’s NFT Moment as a piece of property,
                but do not own the content itself. Collectors may display and share the NFT Moment, but Collectors do
                not have any legal ownership, right, or title to any copyrights, trademarks, or other intellectual
                property rights to the NFT Moment, excepting the limited license to the NFT Moment granted by these
                Terms. Upon collecting a NFT Moment, Collectors receive a limited, worldwide, non-assignable,
                non-sublicensable, royalty-free license to display the NFT Moment legally owned and properly obtained by
                the Collector.
            </TypographyText>

            <TypographyText>
                The Collector’s limited license to display the NFT Moment, includes, but is not limited to, the right to
                display the NFT Moment privately or publicly:
                <br/>
                (1) for the purpose of promoting or sharing the Collector’s purchase, ownership, or interest;
                <br/>
                (2) for the purpose of sharing, promoting, discussing, or commenting on the NFT Moment;
                <br/>
                (3) within decentralized virtual environments, virtual worlds, virtual galleries, virtual museums, or
                other navigable and perceivable virtual environments, including metaverses.
            </TypographyText>

            <TypographyText>
                Collectors have the right to sell, trade, transfer, or use their NFT Moment on the Platform, but
                Collectors may not make “commercial use” of the NFT Moment.
            </TypographyText>

            <TypographyText>
                The Collector agrees that it may not, nor permit any third party, to do or attempt to do any of the
                foregoing without the Creator’s express prior written consent in each case:
                <br/>
                (1) modify, distort, mutilate, or perform any other modification to the Digital Collectible which would
                be prejudicial to the Creator’s honor or reputation;
                <br/>
                (2) use the NFT Moment to advertise, market, or sell any third party product or service;
                <br/>
                (3) use the NFT Moment in connection with images, videos, or other forms of media that depict hatred,
                intolerance, violence, cruelty, or anything else that could reasonably be found to constitute hate
                speech or otherwise infringe upon the rights of others;
                <br/>
                (4) incorporate the NFT Moment in movies, videos, video games, or any other forms of media for a
                commercial purpose, except to the limited extent that such use is expressly permitted by these Terms or
                solely for your Collector’s personal, non-commercial use;
                <br/>
                (5) sell, distribute for commercial gain, or otherwise commercialize merchandise that includes,
                contains, or consists of the NFT Moment;
                <br/>
                (6) attempt to trademark, copyright, or otherwise acquire additional intellectual property rights in or
                to the NFT Moment;
                <br/>
                (7) attempt to mint, tokenize, or create an additional cryptographic token representing the same NFT
                Moment, whether on or off of the GGNFTBOX Platform;
                <br/>
                (8) falsify, misrepresent, or conceal the authorship of the NFT Moment;
                <br/>
                (9) otherwise utilize the NFT Moment for the Collector’s or any third party’s commercial benefit.
            </TypographyText>

            <TypographyText>
                Collectors irrevocably release, acquit, and forever discharge GGNFTBOX and its subsidiaries, affiliates,
                officers, and successors of any liability for direct or indirect copyright or trademark infringement for
                GGNFTBOX use of a NFT Moment in accordance with these Terms.
            </TypographyText>

            <TypographyTitle>
                4.3 Platform Content, Software and Trademarks
            </TypographyTitle>

            <TypographyText>
                You acknowledge and agree that the Platform may contain content or features (“Platform Content”) that
                are protected by copyright, patent, trademark, trade secret or other proprietary rights and laws. Except
                as expressly authorized by GGNFTBOX, you agree not to modify, copy, frame, scrape, rent, lease, loan,
                sell, distribute or create derivative works based on the Platform or the Platform Content, in whole or
                in part. In connection with your use of the Platform you will not engage in or use any data mining,
                robots, scraping or similar data gathering or extraction methods. If you are blocked by GGNFTBOX from
                accessing the Platform (including by blocking your IP address), you agree not to implement any measures
                to circumvent such blocking (e.g., by masking your IP address or using a proxy IP address). Any use of
                the Platform or the Platform Content other than as specifically authorized herein is strictly
                prohibited. The technology and software underlying the Platform or distributed in connection therewith
                are the property of GGNFTBOX, our affiliates and our partners (the “Software”). You agree not to copy,
                modify, create a derivative work of, reverse engineer, reverse assemble or otherwise attempt to discover
                any source code, sell, assign, sublicense, or otherwise transfer any right in the Software. Any rights
                not expressly granted herein are reserved by GGNFTBOX.
            </TypographyText>

            <TypographyText>
                The GGNFTBOX name and logos are trademarks and service marks of GGNFTBOX, LLC. (collectively the
                “GGNFTBOX Trademarks”). Other company, product, and service names and logos used and displayed via the
                Platform may be trademarks or service marks of their respective owners who may or may not endorse or be
                affiliated with or connected to GGNFTBOX. Nothing in this Terms of Service or the Platform should be
                construed as granting, by implication, or otherwise, any license or right to use any of GGNFTBOX
                Trademarks displayed on the Platform, without our prior written permission in each instance. All
                goodwill generated from the use of GGNFTBOX Trademarks will inure to our exclusive benefit.
            </TypographyText>

            <TypographyTitle>
                4.4 Third Party Material
            </TypographyTitle>

            <TypographyText>
                Under no circumstances will GGNFTBOX be liable in any way for any content or materials of any third
                parties (including users), including, but not limited to, for any errors or omissions in any content, or
                for any loss or damage of any kind incurred as a result of the use of any such content. You acknowledge
                that GGNFTBOX does not pre-screen content, but that GGNFTBOX and its designees will have the right (but
                not the obligation) in their sole discretion to refuse or remove any content that is available via the
                Platform. Without limiting the foregoing, GGNFTBOX and its designees will have the right to remove any
                content that violates these Terms of Service or is deemed by Platform, in its sole discretion, to be
                otherwise objectionable. You agree that you must evaluate, and bear all risks associated with, the use
                of any content and the purchase of any Digital Collectibles, including any reliance on the accuracy,
                completeness, or usefulness of such content.
            </TypographyText>

            <TypographyTitle>
                4.5 User Content Transmitted Through the Platform
            </TypographyTitle>

            <TypographyText>
                With respect to the content, or other materials you upload through the Platform or share with other
                users or recipients (collectively, “User Content”), you represent and warrant that you own all right,
                title and interest in and to such User Content, including, without limitation, all copyrights and rights
                of publicity contained therein. By uploading any User Content you hereby grant and will grant GGNFTBOX
                and its affiliated companies a nonexclusive, worldwide, royalty free, fully paid up, transferable,
                sublicensable, perpetual, irrevocable license to copy, display, upload, perform, distribute, store,
                modify and otherwise use your User Content in connection with the operation of the Platform or the
                promotion, advertising or marketing thereof in any form, medium or technology now known or later
                developed.
            </TypographyText>

            <TypographyText>
                Any questions, comments, suggestions, ideas, feedback or other information about the Platform
                (“Submissions”), provided by you to GGNFTBOX are non-confidential and GGNFTBOX will be entitled to the
                unrestricted use and dissemination of these Submissions for any purpose, commercial or otherwise,
                without acknowledgment or compensation to you.
            </TypographyText>

            <TypographyText>
                GGNFTBOX may preserve content and may also disclose content if required to do so by law or in the good
                faith belief that such preservation or disclosure is reasonably necessary to thereof:
                <br/>
                (a) comply with legal process, applicable laws or government requests;
                <br/>
                (b) enforce these Terms of Service;
                <br/>
                (c) respond to claims that any content violates the rights of third parties;
                <br/>
                (d) protect the rights, property, or personal safety of GGNFTBOX, its users and the public.
            </TypographyText>

            <TypographyText>
                You understand that the technical processing and transmission of the Platform, including your content,
                may involve:
                <br/>
                (a) transmissions over various networks;
                <br/>
                (b) changes to conform and adapt to technical requirements of connecting networks or devices.
            </TypographyText>

            <TypographyTitle>
                4.6 Copyright Complaints
            </TypographyTitle>

            <TypographyText>
                GGNFTBOX respects the intellectual property of others, and we ask our users to do the same. If you
                believe that your work has been copied in a way that constitutes copyright infringement, or that your
                intellectual property rights have been otherwise violated, you should notify GGNFTBOX of your
                infringement claim in accordance with the procedure set forth below.
            </TypographyText>

            <TypographyText>
                GGNFTBOX will process and investigate notices of alleged infringement and will take appropriate actions
                under the Digital Millennium Copyright Act (“DMCA”) and other applicable intellectual property laws with
                respect to any alleged or actual infringement. A notification of claimed copyright infringement should
                be emailed to GGNFTBOX’s Support
                {' '}
                <a href={'mailto:support@ggnftbox.com'}>
                    support@ggnftbox.com
                </a>
            </TypographyText>

            <TypographyText>
                To be effective, the notification must be in writing and contain the following information:
                <br/>
                (1) an electronic or physical signature of the person authorized to act on behalf of the owner of
                the
                copyright or other intellectual property interest;
                <br/>
                (2) a description of the copyrighted work or other intellectual property that you claim has been
                infringed;
                <br/>
                (3) a description of where the material that you claim is infringing is located on the Platform,
                with
                enough detail that we may find it on the Platform;
                <br/>
                (4) your address, telephone number, and email address;
                <br/>
                (5) a statement by you that you have a good faith belief that the disputed use is not authorized by
                the
                copyright or intellectual property owner, its agent, or the law;
                <br/>
                (6) a statement by you, made under penalty of perjury, that the above information in your Notice is
                accurate and that you are the copyright or intellectual property owner or authorized to act on the
                copyright or intellectual property owner’s behalf.
            </TypographyText>

            <TypographyTitle>
                4.7 User Agrees to Cooperate with GGNFTBOX
            </TypographyTitle>

            <TypographyText>
                Creators expressly agree to refund to the Collector and/or GGNFTBOX the entire portion of Fees received
                from the sale of a Digital Collectibles that was subsequently removed from the Site pursuant to an
                effective copyright authority organization request (whether under the DMCA or other law). GGNFTBOX will
                not be held liable to any User for removing allegedly infringing works from the Platform or otherwise
                fulfilling its legal obligations under the DMCA or other law.
            </TypographyText>

            <TypographyText>
                Creators, Collectors, and all Users expressly agree to cooperate and timely respond to GGNFTBOX’s
                investigations, requests, and inquiries related to DMCA or other law disputes or allegations of
                infringement. Users agree to initiate a “burn” transaction upon GGNFTBOX’s request for NFT Moments that
                have been permanently removed from the GGNFTBOX marketplace pursuant to a valid DMCA or other law
                conditions, or that are otherwise alleged to be infringing.
            </TypographyText>

            <TypographyTitle>
                5. FEES AND COMMISSIONS
            </TypographyTitle>

            <TypographyText>
                The Fees by standard conditions for an Primary Sale of NFT BOX on GGNFTBOX is as follows:
                <br/>
                (1) Creators receive 75% of the total sale price of a Primary Sale;
                <br/>
                (2) GGNFTBOX collects 25% of the total sale price of a Primary Sale;
                <br/>
                (3) The Fees by non-standard conditions for a Primary Sale are subject to agreements between
                Creator and
                GGNFTBOX and may be different from standard conditions within plus/minus 10%.
                <br/>
                (4) You agree and understand that Creator`s, Collector`s and other beneficiary fees, commissions,
                and
                royalties are transferred, processed, or initiated directly through one or more of the smart contracts
                on the Flow blockchain network.
            </TypographyText>

            <TypographyText>
                The Fees by standard conditions for a Secondary Sale of NFT Moments on GGNFTBOX is as follows:
                <br/>
                (1) Seller receives 90% of the total sale price of a Secondary Sale.
                <br/>
                (2) Original Creator receives 2,5% of the total sale price of a Secondary Sale.
                <br/>
                (3) GGNFTBOX collects 7,5% of the total sale price of a Secondary Sale.
                <br/>
                (4) The Fees by non-standard conditions for a Secondary Sale are subject to agreements between
                original
                Creator and GGNFTBOX and may be different from standard conditions within plus/minus 2,5%.
                <br/>
                (5) You agree and understand that Creator`s, Collector`s and other beneficiary fees, commissions,
                and
                royalties are transferred, processed, or initiated directly through one or more of the smart contracts
                on the Flow blockchain network.
            </TypographyText>

            <TypographyText>
                GGNFTBOX does not generally collect any fees, commissions, or royalties for transactions occurring
                outside of GGNFTBOX. Users irrevocably releases, acquits, and forever discharges GGNFTBOX and its
                subsidiaries, affiliates, officers, and successors of any liability for royalties, fines, or fees not
                received from any off-market transaction.
            </TypographyText>

            <TypographyTitle>
                6. TAXES
            </TypographyTitle>

            <TypographyText>
                Users are responsible to pay any and all sales, use, value-added and other taxes, duties, and
                assessments now or hereafter claimed or imposed by any governmental authority, associated with your use
                of GGNFTBOX (including, without limitation, any taxes that may become payable as the result of your
                ownership, transfer, purchase, sale, or creation of any Digital Collectibles).
            </TypographyText>

            <TypographyTitle>
                7. CONDITIONS OF USE AND PROHIBITED ACTIVITIES
            </TypographyTitle>

            <TypographyText>
                You warrant and agree that your use of the Platform will not (and will not allow any third party
                to) in any manner:
                <br/>
                (1) involve the sending, uploading, distributing or disseminating any unlawful, defamatory,
                harassing,
                abusive, fraudulent, obscene, or otherwise objectionable content;
                <br/>
                (2) involve the distribution of any computer viruses, worms, defects, trojan horses, corrupted
                files,
                hoaxes, or any other items of a destructive or deceptive nature;
                <br/>
                (3) involve the uploading, posting, transmitting or otherwise making available through the Platform
                any
                content that infringes the intellectual proprietary rights of any party;
                <br/>
                (4) involve using the Platform to violate the legal rights (such as rights of privacy and
                publicity) of
                others;
                <br/>
                (5) involve engaging in, promoting, or encouraging illegal activity (including, without limitation,
                money laundering);
                <br/>
                (6) involve interfering with other users’ enjoyment of the Platform;
                <br/>
                (7) involve exploiting the Platform for any unauthorized commercial purpose;
                <br/>
                (8) involve modifying, adapting, translating, or reverse engineering any portion of the Platform;
                <br/>
                (9) involve removing any copyright, trademark or other proprietary rights notices contained in or
                on the
                Platform or any part of it;
                <br/>
                (10) involve reformatting or framing any portion of the Platform;
                <br/>
                (11) involve displaying any content on the Platform that contains any hate-related or violent
                content or
                contains any other material, products or services that violate or encourage conduct that would violate
                any criminal laws, any other applicable laws, or any third party rights;
                <br/>
                (12) involve using any services, site search/retrieval application, or other device to retrieve or
                index
                any portion of the Platform or the content posted on the Platform, or to collect information about its
                users for any unauthorized purpose;
                <br/>
                (13) involve accessing or using the Platform for the purpose of creating a product or service that
                is
                competitive with any of our products or services;
                <br/>
                (14) involve abusing, harassing, or threatening another user of the Platform or any of our
                authorized
                representatives, customer service personnel, chat board moderators, or volunteers (including, without
                limitation, filing support tickets with false information, sending excessive emails or support tickets,
                obstructing our employees from doing their jobs, refusing to follow the instructions of our employees,
                or publicly disparaging us by implying favoritism by a our employees or otherwise);
                <br/>
                (15) involve using any abusive, defamatory, ethnically or racially offensive, harassing, harmful,
                hateful, obscene, offensive, sexually explicit, threatening or vulgar language when communicating with
                another user of the Platform or any of our authorized representatives, customer service personnel, chat
                board moderators, or volunteers;
                <br/>
                (16) involve creating user accounts by automated means or under false or fraudulent pretenses;
                <br/>
                (17) involve the impersonation of another person (via the use of an email address or otherwise);
                <br/>
                (18) involve using, employing, operating, or creating a computer program to simulate the human
                behavior
                of a user (“Bots”);
                <br/>
                (19) involve using, employing, or operating Bots or other similar forms of automation to engage in
                any
                activity or transaction on the Platform (including, without limitation, purchases of NFT BOXes, or of
                NFT Moments on the Marketplace);
                <br/>
                (20) involve acquiring NFT Moments through inappropriate or illegal means (including, among other
                things, using a stolen credit card, or a payment mechanism that you do not have the right to use;
                <br/>
                (21) involve the purchasing, selling or facilitating the purchase and sale of any user’s account(s)
                to
                other users or third parties for cash or cryptocurrency consideration outside of the Platform;
                <br/>
                (22) otherwise involve or result in the wrongful seizure or receipt of any NFT Moments or other
                digital
                assets.
            </TypographyText>

            <TypographyTitle>
                8. INDEMNIFICATION
            </TypographyTitle>
            <TypographyText>
                To the fullest extent permitted by applicable law, you agree to indemnify, defend and hold harmless
                GGNFTBOX, and our respective past, present and future employees, officers, directors, contractors,
                consultants, equity holders, suppliers, vendors, service providers, parent companies, subsidiaries,
                affiliates, agents, representatives, predecessors, successors and assigns (individually and
                collectively, the “GGNFTBOX Parties”), from and against all actual or alleged third party claims,
                damages, awards, judgments, losses, liabilities, obligations, penalties, interest, fees, expenses
                (including, without limitation, attorneys’ fees and expenses) and costs (including, without limitation,
                court costs, costs of settlement and costs of pursuing indemnification and insurance), of every kind and
                nature whatsoever, whether known or unknown, foreseen or unforeseen, matured or unmatured, or suspected
                or unsuspected, in law, whether in tort, contract or otherwise (collectively, “Claims”), including, but
                not limited to, damages to property or personal injury, that are caused by, arise out of or are related
                to thereof:
                <br/>
                (a) your use or misuse of the Platform, Services, or User Information;
                <br/>
                (b) any feedback you provide;
                <br/>
                (c) your violation of these Terms;
                <br/>
                (d) your violation of the rights of a third party, including another user.
                You agree to promptly notify GGNFTBOX of any third party Claims and cooperate with the GGNFTBOX Parties
                in defending such Claims. You further agree that the GGNFTBOX Parties shall have control of the defense
                or settlement of any third party Claims.
            </TypographyText>

            <TypographyText>
                THIS INDEMNITY IS IN ADDITION TO, AND NOT IN LIEU OF, ANY OTHER INDEMNITIES SET FORTH IN A WRITTEN
                AGREEMENT BETWEEN YOU AND GGNFTBOX.
            </TypographyText>

            <TypographyTitle>
                9. DISCLAIMERS
            </TypographyTitle>
            <TypographyText>
                Platform transactions, including but not limited to primary market sales, secondary market sales,
                listings, offers, bids, acceptances, and other operations utilize experimental smart contract and
                blockchain technology, including non-fungible tokens, cryptocurrencies, consensus algorithms, and
                decentralized or peer-to-peer networks and systems. Users acknowledge and agree that such technologies
                are experimental, speculative, and inherently risky and may be subject to bugs, malfunctions, timing
                errors, hacking and theft, or changes to the protocol rules of the blockchain (i.e., “forks“), which can
                adversely affect the smart contracts and may expose you to a risk of total loss, forfeiture of your
                digital currency or Digital Collectibles, or lost opportunities to buy or sell Digital Collectibles.
            </TypographyText>

            <TypographyText>
                YOUR USE OF THE PLATFORM IS AT YOUR SOLE RISK. THE PLATFORM IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE”
                BASIS. GGNFTBOX EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED OR STATUTORY,
                INCLUDING, BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                PURPOSE, TITLE AND NON-INFRINGEMENT. GGNFTBOX MAKES NO WARRANTY TO THEREOF:
                <br/>
                (1) THE PLATFORM WILL MEET YOUR REQUIREMENTS;
                <br/>
                (2) THE PLATFORM WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE;
                <br/>
                (3) THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE PLATFORM WILL BE ACCURATE OR RELIABLE;
                <br/>
                (4) THE QUALITY OF ANY PRODUCTS, PLATFORMS, INFORMATION, OR OTHER MATERIAL PURCHASED OR OBTAINED BY
                YOU
                THROUGH THE PLATFORM WILL MEET YOUR EXPECTATIONS.
            </TypographyText>
            <TypographyTitle>
                10. FORCE MAJEURE
            </TypographyTitle>
            <TypographyText>
                (1) Force Majeure Events. We will not be liable or responsible to the you, nor be deemed to have
                defaulted under or breached these Terms, for any failure or delay in fulfilling or performing any of
                these Terms, when and to the extent such failure or delay is caused by or results from the following
                force majeure events (“Force Majeure Event(s)“):
                <br/>
                (a) natural disasters;
                <br/>
                (b) flood, fire, earthquake, epidemics, pandemics, including the 2019 coronavirus pandemic
                (COVID-19),
                tsunami, explosion;
                <br/>
                (c) war, invasion, hostilities (whether war is declared or not), terrorist threats or acts, riot or
                other civil unrest;
                <br/>
                (d) government order, law, or action;
                <br/>
                (e) embargoes or blockades in effect on or after the date of this agreement;
                <br/>
                (f) strikes, labour stoppages or slowdowns or other industrial disturbances;
                <br/>
                (g) shortage of adequate or suitable Internet connectivity, telecommunication breakdown or shortage
                of
                adequate power or electricity;
                <br/>
                (h) other similar events beyond our control.
                <br/>

                <br/>
                (2) Performance During Force Majeure Events. If we suffer a Force Majeure Event, we will use
                reasonable
                efforts to promptly notify you of the Force Majeure Event, stating the period of time the occurrence is
                expected to continue. We will use diligent efforts to end the failure or delay and ensure the effects of
                such Force Majeure Event are minimized.
            </TypographyText>

            <TypographyTitle>
                11. LIMITATION OF LIABILITY
            </TypographyTitle>
            <TypographyText>
                TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT WILL GGNFTBOX BE LIABLE TO YOU OR ANY THIRD PARTY
                FOR ANY LOST PROFIT OR ANY INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL OR PUNITIVE DAMAGES
                ARISING FROM THESE TERMS, THE SERVICE, PRODUCTS OR THIRD PARTY SITES AND PRODUCTS, OR FOR ANY DAMAGES
                RELATED TO LOSS OF REVENUE, LOSS OF PROFITS, LOSS OF BUSINESS OR ANTICIPATED SAVINGS, LOSS OF USE, LOSS
                OF GOODWILL, OR LOSS OF DATA, AND WHETHER CAUSED BY TORT (INCLUDING NEGLIGENCE), BREACH OF CONTRACT, OR
                OTHERWISE, EVEN IF FORESEEABLE AND EVEN IF GGNFTBOX HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                ACCESS TO, AND USE OF, THE SERVICES, PRODUCTS OR THIRD PARTY SITES AND PRODUCTS ARE AT YOUR OWN
                DISCRETION AND RISK, AND YOU WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR COMPUTER SYSTEM OR MOBILE
                DEVICE OR LOSS OF DATA RESULTING THEREFROM. NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN,
                IN NO EVENT SHALL THE MAXIMUM AGGREGATE LIABILITY OF GGNFTBOX ARISING OUT OF OR IN ANY WAY RELATED TO
                THE AGREEMENT, THE ACCESS TO AND USE OF THE SERVICE, CONTENT, DIGITAL COLLECTIBLES, OR ANY PRODUCTS OR
                SERVICES PURCHASED ON THE SERVICE EXCEED $100. THE FOREGOING LIMITATIONS OF LIABILITY SHALL NOT APPLY TO
                LIABILITY OF GGNFTBOX FOR THESE CASES:
                <br/>
                (A) DEATH OR PERSONAL INJURY CAUSED BY A MEMBER OF GGNFTBOX NEGLIGENCE;
                <br/>
                (B) ANY INJURY CAUSED BY A MEMBER OF GGNFTBOX FRAUD OR FRAUDULENT MISREPRESENTATION.
            </TypographyText>

            <TypographyTitle>
                12. MODIFICATIONS OF THE SERVICE
            </TypographyTitle>
            <TypographyText>
                We reserve the right in our sole discretion to modify, suspend or discontinue, temporarily or
                permanently, the Services (or any features or parts thereof) or suspend or discontinue the Digital
                Collectible or the Transaction at any time and without liability therefore.
            </TypographyText>

            <TypographyTitle>

                13. TERMINATION
            </TypographyTitle>
            <TypographyText>
                You agree that GGNFTBOX, in its sole discretion, may suspend or terminate your account (or any part
                thereof) or use of the Platform and remove and discard any content within the Platform, for any reason,
                including, without limitation, for lack of use or if GGNFTBOX believes that you have violated or acted
                inconsistently with these Terms of Service. Any suspected fraudulent, abusive or illegal activity that
                may be grounds for termination of your use of Platform, may be referred to appropriate law enforcement
                authorities. GGNFTBOX may also in its sole discretion and at any time discontinue providing the
                Platform, or any part thereof, with or without notice. You agree that any termination of your access to
                the Platform under any provision of this Terms of Service may be effected without prior notice, and
                acknowledge and agree that GGNFTBOX may immediately deactivate or delete your account and all related
                information and files in your account and/or bar any further access to such files or the Platform.
                Further, you agree that GGNFTBOX will not be liable to you or any third party for any termination of
                your access to the Platform.
            </TypographyText>

            <TypographyTitle>
                14. USER DISPUTES
            </TypographyTitle>
            <TypographyText>
                You agree that you are solely responsible for your interactions with any other Users in connection with
                the Platform and GGNFTBOX will have no liability or responsibility with respect thereto. GGNFTBOX
                reserves the right, but has no obligation, to become involved in any way with disputes between you and
                any other user of the Platform.
            </TypographyText>

            <TypographyTitle>
                15. GENERAL
            </TypographyTitle>
            <TypographyText>
                These Terms of Service constitute the entire agreement between you and GGNFTBOX and govern your use of
                the Platform, superseding any prior agreements between you and GGNFTBOX with respect to the Platform.
                You also may be subject to additional terms and conditions that may apply when you use affiliate or
                third party services, third party content or third party software. These Terms of Service will be
                governed by the Civil Law. The failure of GGNFTBOX to exercise or enforce any right or provision of
                these Terms of Service will not constitute a waiver of such right or provision. If any provision of
                these Terms of Service is found by a court to be invalid, the parties nevertheless agree that the court
                should endeavor to give effect to the parties’ intentions as reflected in the provision, and the other
                provisions of these Terms of Service remain in full force and effect. You agree that regardless of any
                statute or law to the contrary, any claim or cause of action arising out of or related to use of the
                Platform or these Terms of Service must be filed within one (1) year after such claim or cause of action
                arose or be forever barred. A printed version of this agreement and of any notice given in electronic
                form will be admissible in judicial or administrative proceedings based upon or relating to this
                agreement to the same extent and subject to the same conditions as other business documents and records
                originally generated and maintained in printed form. You may not assign this Terms of Service without
                the prior written consent of GGNFTBOX, but GGNFTBOX may assign or transfer this Terms of Service, in
                whole or in part, without restriction. The section titles in these Terms of Service are for convenience
                only and have no legal or contractual effect. Notices to you may be made via either email or regular
                mail. The Platform may also provide notices to you of changes to these Terms of Service or other matters
                by displaying notices or links to notices generally on the Platform.
            </TypographyText>

            <TypographyTitle>
                16. PRIVACY POLICY
            </TypographyTitle>

            <TypographyText>
                Our privacy policy is a part of these Terms. Please review the GGNFTBOX Privacy Policy, which also
                governs the Platform and informs Users of our data collection practices.
            </TypographyText>
        </>
    )
}

export default Terms