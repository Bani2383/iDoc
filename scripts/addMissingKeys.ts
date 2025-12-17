#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const LOCALES_DIR = join(process.cwd(), 'src/locales');

const missingKeysTranslations: Record<string, Record<string, any>> = {
  en: {
    'common.error': 'Error',
    'nav.templates': 'Templates',
    'stats.totalVisitors': 'Total Visitors',
    'stats.documentsGenerated': 'Documents Generated',
    'stats.activeUsers': 'Active Users',
    'stats.signaturesCreated': 'Signatures',
    'stats.liveUpdate': 'Updated in real time',
    'footer.copyright': '© 2024 iDoc. All rights reserved.'
  },
  fr: {
    'common.error': 'Erreur',
    'nav.templates': 'Modèles',
    'stats.totalVisitors': 'Visiteurs',
    'stats.documentsGenerated': 'Documents Créés',
    'stats.activeUsers': 'Utilisateurs Actifs',
    'stats.signaturesCreated': 'Signatures',
    'stats.liveUpdate': 'Mis à jour en temps réel',
    'footer.copyright': '© 2024 iDoc. Tous droits réservés.'
  },
  es: {
    'common.error': 'Error',
    'nav.templates': 'Plantillas',
    'stats.totalVisitors': 'Visitantes',
    'stats.documentsGenerated': 'Documentos Creados',
    'stats.activeUsers': 'Usuarios Activos',
    'stats.signaturesCreated': 'Firmas',
    'stats.liveUpdate': 'Actualizado en tiempo real',
    'footer.copyright': '© 2024 iDoc. Todos los derechos reservados.'
  },
  de: {
    'common.error': 'Fehler',
    'nav.templates': 'Vorlagen',
    'stats.totalVisitors': 'Besucher',
    'stats.documentsGenerated': 'Dokumente erstellt',
    'stats.activeUsers': 'Aktive Benutzer',
    'stats.signaturesCreated': 'Unterschriften',
    'stats.liveUpdate': 'In Echtzeit aktualisiert',
    'footer.copyright': '© 2024 iDoc. Alle Rechte vorbehalten.'
  },
  it: {
    'common.error': 'Errore',
    'nav.templates': 'Modelli',
    'stats.totalVisitors': 'Visitatori',
    'stats.documentsGenerated': 'Documenti Creati',
    'stats.activeUsers': 'Utenti Attivi',
    'stats.signaturesCreated': 'Firme',
    'stats.liveUpdate': 'Aggiornato in tempo reale',
    'footer.copyright': '© 2024 iDoc. Tutti i diritti riservati.'
  },
  pt: {
    'common.error': 'Erro',
    'nav.templates': 'Modelos',
    'stats.totalVisitors': 'Visitantes',
    'stats.documentsGenerated': 'Documentos Criados',
    'stats.activeUsers': 'Usuários Ativos',
    'stats.signaturesCreated': 'Assinaturas',
    'stats.liveUpdate': 'Atualizado em tempo real',
    'footer.copyright': '© 2024 iDoc. Todos os direitos reservados.'
  },
  ar: {
    'common.error': 'خطأ',
    'nav.templates': 'النماذج',
    'stats.totalVisitors': 'الزوار',
    'stats.documentsGenerated': 'المستندات المنشأة',
    'stats.activeUsers': 'المستخدمون النشطون',
    'stats.signaturesCreated': 'التوقيعات',
    'stats.liveUpdate': 'محدث في الوقت الفعلي',
    'footer.copyright': '© 2024 iDoc. جميع الحقوق محفوظة.'
  },
  zh: {
    'common.error': '错误',
    'nav.templates': '模板',
    'stats.totalVisitors': '访客',
    'stats.documentsGenerated': '已创建文档',
    'stats.activeUsers': '活跃用户',
    'stats.signaturesCreated': '签名',
    'stats.liveUpdate': '实时更新',
    'footer.copyright': '© 2024 iDoc. 保留所有权利。'
  },
  ja: {
    'common.error': 'エラー',
    'nav.templates': 'テンプレート',
    'stats.totalVisitors': '訪問者',
    'stats.documentsGenerated': '作成されたドキュメント',
    'stats.activeUsers': 'アクティブユーザー',
    'stats.signaturesCreated': '署名',
    'stats.liveUpdate': 'リアルタイムで更新',
    'footer.copyright': '© 2024 iDoc. 無断転載禁止。'
  },
  ko: {
    'common.error': '오류',
    'nav.templates': '템플릿',
    'stats.totalVisitors': '방문자',
    'stats.documentsGenerated': '생성된 문서',
    'stats.activeUsers': '활성 사용자',
    'stats.signaturesCreated': '서명',
    'stats.liveUpdate': '실시간 업데이트',
    'footer.copyright': '© 2024 iDoc. 판권 소유.'
  },
  ru: {
    'common.error': 'Ошибка',
    'nav.templates': 'Шаблоны',
    'stats.totalVisitors': 'Посетители',
    'stats.documentsGenerated': 'Созданные документы',
    'stats.activeUsers': 'Активные пользователи',
    'stats.signaturesCreated': 'Подписи',
    'stats.liveUpdate': 'Обновляется в реальном времени',
    'footer.copyright': '© 2024 iDoc. Все права защищены.'
  },
  pl: {
    'common.error': 'Błąd',
    'nav.templates': 'Szablony',
    'stats.totalVisitors': 'Odwiedzający',
    'stats.documentsGenerated': 'Utworzone dokumenty',
    'stats.activeUsers': 'Aktywni użytkownicy',
    'stats.signaturesCreated': 'Podpisy',
    'stats.liveUpdate': 'Aktualizowane w czasie rzeczywistym',
    'footer.copyright': '© 2024 iDoc. Wszelkie prawa zastrzeżone.'
  },
  nl: {
    'common.error': 'Fout',
    'nav.templates': 'Sjablonen',
    'stats.totalVisitors': 'Bezoekers',
    'stats.documentsGenerated': 'Documenten gemaakt',
    'stats.activeUsers': 'Actieve gebruikers',
    'stats.signaturesCreated': 'Handtekeningen',
    'stats.liveUpdate': 'Realtime bijgewerkt',
    'footer.copyright': '© 2024 iDoc. Alle rechten voorbehouden.'
  },
  tr: {
    'common.error': 'Hata',
    'nav.templates': 'Şablonlar',
    'stats.totalVisitors': 'Ziyaretçiler',
    'stats.documentsGenerated': 'Oluşturulan Belgeler',
    'stats.activeUsers': 'Aktif Kullanıcılar',
    'stats.signaturesCreated': 'İmzalar',
    'stats.liveUpdate': 'Gerçek zamanlı güncellendi',
    'footer.copyright': '© 2024 iDoc. Tüm hakları saklıdır.'
  },
  sv: {
    'common.error': 'Fel',
    'nav.templates': 'Mallar',
    'stats.totalVisitors': 'Besökare',
    'stats.documentsGenerated': 'Dokument skapade',
    'stats.activeUsers': 'Aktiva användare',
    'stats.signaturesCreated': 'Signaturer',
    'stats.liveUpdate': 'Uppdaterad i realtid',
    'footer.copyright': '© 2024 iDoc. Alla rättigheter förbehållna.'
  },
  no: {
    'common.error': 'Feil',
    'nav.templates': 'Maler',
    'stats.totalVisitors': 'Besøkende',
    'stats.documentsGenerated': 'Dokumenter opprettet',
    'stats.activeUsers': 'Aktive brukere',
    'stats.signaturesCreated': 'Signaturer',
    'stats.liveUpdate': 'Oppdatert i sanntid',
    'footer.copyright': '© 2024 iDoc. Alle rettigheter reservert.'
  },
  da: {
    'common.error': 'Fejl',
    'nav.templates': 'Skabeloner',
    'stats.totalVisitors': 'Besøgende',
    'stats.documentsGenerated': 'Dokumenter oprettet',
    'stats.activeUsers': 'Aktive brugere',
    'stats.signaturesCreated': 'Underskrifter',
    'stats.liveUpdate': 'Opdateret i realtid',
    'footer.copyright': '© 2024 iDoc. Alle rettigheder forbeholdes.'
  },
  fi: {
    'common.error': 'Virhe',
    'nav.templates': 'Mallit',
    'stats.totalVisitors': 'Vierailijat',
    'stats.documentsGenerated': 'Luodut asiakirjat',
    'stats.activeUsers': 'Aktiiviset käyttäjät',
    'stats.signaturesCreated': 'Allekirjoitukset',
    'stats.liveUpdate': 'Päivitetty reaaliajassa',
    'footer.copyright': '© 2024 iDoc. Kaikki oikeudet pidätetään.'
  },
  cs: {
    'common.error': 'Chyba',
    'nav.templates': 'Šablony',
    'stats.totalVisitors': 'Návštěvníci',
    'stats.documentsGenerated': 'Vytvořené dokumenty',
    'stats.activeUsers': 'Aktivní uživatelé',
    'stats.signaturesCreated': 'Podpisy',
    'stats.liveUpdate': 'Aktualizováno v reálném čase',
    'footer.copyright': '© 2024 iDoc. Všechna práva vyhrazena.'
  },
  ro: {
    'common.error': 'Eroare',
    'nav.templates': 'Șabloane',
    'stats.totalVisitors': 'Vizitatori',
    'stats.documentsGenerated': 'Documente create',
    'stats.activeUsers': 'Utilizatori activi',
    'stats.signaturesCreated': 'Semnături',
    'stats.liveUpdate': 'Actualizat în timp real',
    'footer.copyright': '© 2024 iDoc. Toate drepturile rezervate.'
  },
  hu: {
    'common.error': 'Hiba',
    'nav.templates': 'Sablonok',
    'stats.totalVisitors': 'Látogatók',
    'stats.documentsGenerated': 'Létrehozott dokumentumok',
    'stats.activeUsers': 'Aktív felhasználók',
    'stats.signaturesCreated': 'Aláírások',
    'stats.liveUpdate': 'Valós időben frissítve',
    'footer.copyright': '© 2024 iDoc. Minden jog fenntartva.'
  },
  el: {
    'common.error': 'Σφάλμα',
    'nav.templates': 'Πρότυπα',
    'stats.totalVisitors': 'Επισκέπτες',
    'stats.documentsGenerated': 'Έγγραφα που δημιουργήθηκαν',
    'stats.activeUsers': 'Ενεργοί χρήστες',
    'stats.signaturesCreated': 'Υπογραφές',
    'stats.liveUpdate': 'Ενημερώθηκε σε πραγματικό χρόνο',
    'footer.copyright': '© 2024 iDoc. Με επιφύλαξη παντός δικαιώματος.'
  },
  he: {
    'common.error': 'שגיאה',
    'nav.templates': 'תבניות',
    'stats.totalVisitors': 'מבקרים',
    'stats.documentsGenerated': 'מסמכים שנוצרו',
    'stats.activeUsers': 'משתמשים פעילים',
    'stats.signaturesCreated': 'חתימות',
    'stats.liveUpdate': 'עודכן בזמן אמת',
    'footer.copyright': '© 2024 iDoc. כל הזכויות שמורות.'
  },
  hi: {
    'common.error': 'त्रुटि',
    'nav.templates': 'टेम्पलेट',
    'stats.totalVisitors': 'आगंतुक',
    'stats.documentsGenerated': 'बनाए गए दस्तावेज़',
    'stats.activeUsers': 'सक्रिय उपयोगकर्ता',
    'stats.signaturesCreated': 'हस्ताक्षर',
    'stats.liveUpdate': 'वास्तविक समय में अपडेट किया गया',
    'footer.copyright': '© 2024 iDoc. सर्वाधिकार सुरक्षित।'
  },
  th: {
    'common.error': 'ข้อผิดพลาด',
    'nav.templates': 'เทมเพลต',
    'stats.totalVisitors': 'ผู้เยี่ยมชม',
    'stats.documentsGenerated': 'เอกสารที่สร้าง',
    'stats.activeUsers': 'ผู้ใช้ที่ใช้งานอยู่',
    'stats.signaturesCreated': 'ลายเซ็น',
    'stats.liveUpdate': 'อัปเดตแบบเรียลไทม์',
    'footer.copyright': '© 2024 iDoc. สงวนลิขสิทธิ์.'
  },
  vi: {
    'common.error': 'Lỗi',
    'nav.templates': 'Mẫu',
    'stats.totalVisitors': 'Khách truy cập',
    'stats.documentsGenerated': 'Tài liệu đã tạo',
    'stats.activeUsers': 'Người dùng hoạt động',
    'stats.signaturesCreated': 'Chữ ký',
    'stats.liveUpdate': 'Cập nhật theo thời gian thực',
    'footer.copyright': '© 2024 iDoc. Đã đăng ký bản quyền.'
  },
  id: {
    'common.error': 'Kesalahan',
    'nav.templates': 'Template',
    'stats.totalVisitors': 'Pengunjung',
    'stats.documentsGenerated': 'Dokumen yang dibuat',
    'stats.activeUsers': 'Pengguna aktif',
    'stats.signaturesCreated': 'Tanda tangan',
    'stats.liveUpdate': 'Diperbarui secara real-time',
    'footer.copyright': '© 2024 iDoc. Hak cipta dilindungi.'
  },
  ms: {
    'common.error': 'Ralat',
    'nav.templates': 'Templat',
    'stats.totalVisitors': 'Pengunjung',
    'stats.documentsGenerated': 'Dokumen dicipta',
    'stats.activeUsers': 'Pengguna aktif',
    'stats.signaturesCreated': 'Tandatangan',
    'stats.liveUpdate': 'Dikemas kini secara masa nyata',
    'footer.copyright': '© 2024 iDoc. Hak cipta terpelihara.'
  },
  fa: {
    'common.error': 'خطا',
    'nav.templates': 'قالب‌ها',
    'stats.totalVisitors': 'بازدیدکنندگان',
    'stats.documentsGenerated': 'اسناد ایجاد شده',
    'stats.activeUsers': 'کاربران فعال',
    'stats.signaturesCreated': 'امضاها',
    'stats.liveUpdate': 'به‌روزرسانی لحظه‌ای',
    'footer.copyright': '© ۲۰۲۴ iDoc. کلیه حقوق محفوظ است.'
  },
  uk: {
    'common.error': 'Помилка',
    'nav.templates': 'Шаблони',
    'stats.totalVisitors': 'Відвідувачі',
    'stats.documentsGenerated': 'Створені документи',
    'stats.activeUsers': 'Активні користувачі',
    'stats.signaturesCreated': 'Підписи',
    'stats.liveUpdate': 'Оновлюється в реальному часі',
    'footer.copyright': '© 2024 iDoc. Усі права захищені.'
  }
};

function setNestedKey(obj: any, path: string, value: any) {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
}

function main() {
  console.log('🔧 Adding missing translation keys...\n');

  const files = readdirSync(LOCALES_DIR)
    .filter(f => f.endsWith('.json'));

  let updatedCount = 0;

  files.forEach(filename => {
    const filepath = join(LOCALES_DIR, filename);
    const lang = filename.replace('.json', '');

    try {
      const content = readFileSync(filepath, 'utf-8');
      const translations = JSON.parse(content);

      const keysToAdd = missingKeysTranslations[lang] || missingKeysTranslations['en'];

      let hasChanges = false;
      Object.entries(keysToAdd).forEach(([key, value]) => {
        const keys = key.split('.');
        let current: any = translations;
        let exists = true;

        for (const k of keys) {
          if (!current[k]) {
            exists = false;
            break;
          }
          current = current[k];
        }

        if (!exists) {
          setNestedKey(translations, key, value);
          hasChanges = true;
        }
      });

      if (hasChanges) {
        writeFileSync(filepath, JSON.stringify(translations, null, 2) + '\n', 'utf-8');
        console.log(`✅ Updated: ${lang}`);
        updatedCount++;
      } else {
        console.log(`⏭️  Skipped: ${lang} (no changes needed)`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${lang}:`, error);
    }
  });

  console.log(`\n✨ Updated ${updatedCount} language files`);
}

main();
